import { memo, useState, useMemo } from 'react'
import {
  Card,
  Table,
  Button,
  Space,
  Input,
  Modal,
  Form,
  Select,
  message,
  Popconfirm,
  Tag,
  Empty,
  Typography,
  Tabs,
  Badge,
  Descriptions,
} from 'antd'
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  ReloadOutlined,
} from '@ant-design/icons'
import type {
  SyncJob,
  SyncRun,
  CreateSyncJobRequest,
  UpdateSyncJobRequest,
} from '@/types/sync'
import { SyncJobStatus, SyncRunStatus } from '@/types/sync'
import { syncApi } from '@/services/sync.service'
import { targetApi } from '@/services/target.service'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
// Helper function to format date
const formatDate = (date: string | Date | undefined): string => {
  if (!date) return '-'
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

const formatDateShort = (date: string | Date | undefined): string => {
  if (!date) return 'Never'
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

const getDuration = (start: string, end?: string): string => {
  if (!end) return '-'
  const startDate = new Date(start)
  const endDate = new Date(end)
  const duration = Math.floor((endDate.getTime() - startDate.getTime()) / 1000)
  return `${duration}s`
}

const { Title } = Typography

interface SyncSectionProps {
  sourceId: string
  targetId?: string
}

export const SyncSection = memo<SyncSectionProps>(({ sourceId, targetId }) => {
  const queryClient = useQueryClient()
  const [syncJobForm] = Form.useForm()
  const [isJobModalOpen, setIsJobModalOpen] = useState(false)
  const [isRunModalOpen, setIsRunModalOpen] = useState(false)
  const [editingSyncJob, setEditingSyncJob] = useState<SyncJob | null>(null)
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null)
  const [jobSearch, setJobSearch] = useState('')
  const [jobStatusFilter, setJobStatusFilter] = useState<SyncJobStatus | undefined>(undefined)

  // Fetch sync jobs
  const { data: syncJobsData, isLoading: syncJobsLoading } = useQuery({
    queryKey: ['sync-jobs', sourceId, targetId, jobSearch, jobStatusFilter],
    queryFn: () =>
      syncApi.getSyncJobs({
        sourceId,
        targetId,
        status: jobStatusFilter,
        search: jobSearch || undefined,
        page: 1,
        take: 100,
      }),
    enabled: !!sourceId,
  })

  // Fetch targets for dropdown
  const { data: targetsData } = useQuery({
    queryKey: ['targets', sourceId],
    queryFn: () =>
      targetApi.getTargets({
        page: 1,
        take: 1000,
      }),
    enabled: !!sourceId && isJobModalOpen,
  })

  // Fetch sync runs for selected job
  const { data: syncRunsData, isLoading: syncRunsLoading } = useQuery({
    queryKey: ['sync-runs', selectedJobId],
    queryFn: () =>
      syncApi.getSyncRuns({
        jobId: selectedJobId || undefined,
        page: 1,
        take: 100,
      }),
    enabled: !!selectedJobId,
  })

  // Filtered targets (only show targets that belong to the same project as source)
  const availableTargets = useMemo(() => {
    if (!targetsData?.items) return []
    return targetsData.items
  }, [targetsData?.items])

  // Sync Job mutations
  const createSyncJobMutation = useMutation({
    mutationFn: (data: CreateSyncJobRequest) => syncApi.createSyncJob(data),
    onSuccess: () => {
      message.success('Sync job created successfully')
      queryClient.invalidateQueries({ queryKey: ['sync-jobs'] })
      setIsJobModalOpen(false)
      syncJobForm.resetFields()
      setEditingSyncJob(null)
    },
    onError: (error: any) => {
      message.error(error?.errorMessage || 'Failed to create sync job')
    },
  })

  const updateSyncJobMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateSyncJobRequest }) =>
      syncApi.updateSyncJob(id, data),
    onSuccess: () => {
      message.success('Sync job updated successfully')
      queryClient.invalidateQueries({ queryKey: ['sync-jobs'] })
      setIsJobModalOpen(false)
      syncJobForm.resetFields()
      setEditingSyncJob(null)
    },
    onError: (error: any) => {
      message.error(error?.errorMessage || 'Failed to update sync job')
    },
  })

  const deleteSyncJobMutation = useMutation({
    mutationFn: (id: string) => syncApi.deleteSyncJob(id),
    onSuccess: () => {
      message.success('Sync job deleted successfully')
      queryClient.invalidateQueries({ queryKey: ['sync-jobs'] })
    },
    onError: (error: any) => {
      message.error(error?.errorMessage || 'Failed to delete sync job')
    },
  })

  const triggerSyncMutation = useMutation({
    mutationFn: (jobId: string) => syncApi.triggerSync({ jobId }),
    onSuccess: () => {
      message.success('Sync triggered successfully')
      queryClient.invalidateQueries({ queryKey: ['sync-jobs'] })
      queryClient.invalidateQueries({ queryKey: ['sync-runs'] })
    },
    onError: (error: any) => {
      message.error(error?.errorMessage || 'Failed to trigger sync')
    },
  })

  const handleCreateJob = () => {
    setEditingSyncJob(null)
    syncJobForm.resetFields()
    syncJobForm.setFieldsValue({ sourceId, type: 'full' })
    setIsJobModalOpen(true)
  }

  const handleEditJob = (job: SyncJob) => {
    setEditingSyncJob(job)
    syncJobForm.setFieldsValue({
      targetId: job.targetId,
      type: job.type,
      scheduleCron: job.scheduleCron,
      status: job.status,
    })
    setIsJobModalOpen(true)
  }

  const handleJobSubmit = () => {
    syncJobForm.validateFields().then((values) => {
      if (editingSyncJob) {
        updateSyncJobMutation.mutate({
          id: editingSyncJob.id,
          data: values,
        })
      } else {
        createSyncJobMutation.mutate({
          ...values,
          sourceId,
        })
      }
    })
  }

  const handleTriggerSync = (jobId: string) => {
    triggerSyncMutation.mutate(jobId)
  }

  const handleViewRuns = (job: SyncJob) => {
    setSelectedJobId(job.id)
    setIsRunModalOpen(true)
  }

  const getStatusTag = (status: SyncJobStatus) => {
    const statusConfig = {
      [SyncJobStatus.IDLE]: { color: 'default', text: 'Idle' },
      [SyncJobStatus.RUNNING]: { color: 'processing', text: 'Running' },
      [SyncJobStatus.PAUSED]: { color: 'warning', text: 'Paused' },
      [SyncJobStatus.ERROR]: { color: 'error', text: 'Error' },
    }
    const config = statusConfig[status]
    return <Tag color={config.color}>{config.text}</Tag>
  }

  const getRunStatusTag = (status?: SyncRunStatus) => {
    if (!status) return <Tag>Unknown</Tag>
    const statusConfig = {
      [SyncRunStatus.RUNNING]: { color: 'processing', text: 'Running' },
      [SyncRunStatus.SUCCESS]: { color: 'success', text: 'Success' },
      [SyncRunStatus.FAILED]: { color: 'error', text: 'Failed' },
      [SyncRunStatus.CANCELLED]: { color: 'default', text: 'Cancelled' },
    }
    const config = statusConfig[status]
    return <Tag color={config.color}>{config.text}</Tag>
  }

  const jobColumns = [
    {
      title: 'Target',
      dataIndex: 'target',
      key: 'target',
      render: (target: SyncJob['target']) => target?.name || 'N/A',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => <Tag>{type}</Tag>,
    },
    {
      title: 'Schedule',
      dataIndex: 'scheduleCron',
      key: 'scheduleCron',
      render: (cron: string) => cron || <Tag color="default">Manual</Tag>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: SyncJobStatus) => getStatusTag(status),
    },
    {
      title: 'Last Run',
      dataIndex: 'lastRunAt',
      key: 'lastRunAt',
      render: (date: string) => formatDateShort(date),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: SyncJob) => (
        <Space>
          <Button
            type="link"
            icon={<PlayCircleOutlined />}
            onClick={() => handleTriggerSync(record.id)}
            disabled={record.status === SyncJobStatus.RUNNING}
            loading={triggerSyncMutation.isPending}
          >
            Trigger
          </Button>
          <Button
            type="link"
            icon={<ReloadOutlined />}
            onClick={() => handleViewRuns(record)}
          >
            View Runs
          </Button>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEditJob(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this sync job?"
            onConfirm={() => deleteSyncJobMutation.mutate(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
              loading={deleteSyncJobMutation.isPending}
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  const runColumns = [
    {
      title: 'Started At',
      dataIndex: 'startedAt',
      key: 'startedAt',
      render: (date: string) => formatDate(date),
    },
    {
      title: 'Finished At',
      dataIndex: 'finishedAt',
      key: 'finishedAt',
      render: (date: string) => formatDate(date),
    },
    {
      title: 'Duration',
      key: 'duration',
      render: (_: any, record: SyncRun) => getDuration(record.startedAt, record.finishedAt),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: SyncRunStatus) => getRunStatusTag(status),
    },
    {
      title: 'Metrics',
      dataIndex: 'metrics',
      key: 'metrics',
      render: (metrics: Record<string, any>) => {
        if (!metrics) return '-'
        return (
          <Space direction="vertical" size="small">
            {metrics.recordsProcessed !== undefined && (
              <span>Processed: {metrics.recordsProcessed}</span>
            )}
            {metrics.recordsInserted !== undefined && (
              <span>Inserted: {metrics.recordsInserted}</span>
            )}
            {metrics.recordsUpdated !== undefined && (
              <span>Updated: {metrics.recordsUpdated}</span>
            )}
          </Space>
        )
      },
    },
  ]

  return (
    <Card>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={4} style={{ margin: 0 }}>
          Sync Jobs
        </Title>
        <Space>
          <Input
            placeholder="Search sync jobs..."
            prefix={<SearchOutlined />}
            value={jobSearch}
            onChange={(e) => setJobSearch(e.target.value)}
            style={{ width: 200 }}
          />
          <Select
            placeholder="Filter by status"
            value={jobStatusFilter}
            onChange={setJobStatusFilter}
            allowClear
            style={{ width: 150 }}
          >
            <Select.Option value={SyncJobStatus.IDLE}>Idle</Select.Option>
            <Select.Option value={SyncJobStatus.RUNNING}>Running</Select.Option>
            <Select.Option value={SyncJobStatus.PAUSED}>Paused</Select.Option>
            <Select.Option value={SyncJobStatus.ERROR}>Error</Select.Option>
          </Select>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreateJob}
          >
            Create Sync Job
          </Button>
        </Space>
      </div>

      <Table
        columns={jobColumns}
        dataSource={syncJobsData?.items || []}
        loading={syncJobsLoading}
        rowKey="id"
        pagination={{
          current: syncJobsData?.meta.page || 1,
          pageSize: syncJobsData?.meta.take || 10,
          total: syncJobsData?.meta.totalItems || 0,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} sync jobs`,
        }}
        locale={{
          emptyText: (
            <Empty
              description="No sync jobs found"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          ),
        }}
      />

      {/* Create/Edit Sync Job Modal */}
      <Modal
        title={editingSyncJob ? 'Edit Sync Job' : 'Create Sync Job'}
        open={isJobModalOpen}
        onOk={handleJobSubmit}
        onCancel={() => {
          setIsJobModalOpen(false)
          syncJobForm.resetFields()
          setEditingSyncJob(null)
        }}
        confirmLoading={
          createSyncJobMutation.isPending || updateSyncJobMutation.isPending
        }
      >
        <Form form={syncJobForm} layout="vertical">
          <Form.Item
            name="targetId"
            label="Target"
            rules={[{ required: true, message: 'Please select a target' }]}
          >
            <Select
              placeholder="Select target"
              disabled={!!editingSyncJob}
              notFoundContent={
                availableTargets.length === 0
                  ? 'No targets available. Please create a target first.'
                  : undefined
              }
            >
              {availableTargets.map((target) => (
                <Select.Option key={target.id} value={target.id}>
                  {target.name} ({target.kind})
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="type"
            label="Sync Type"
            rules={[{ required: true, message: 'Please select sync type' }]}
          >
            <Select placeholder="Select sync type">
              <Select.Option value="full">Full Sync</Select.Option>
              <Select.Option value="incremental">Incremental Sync</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="scheduleCron"
            label="Schedule (Cron Expression)"
            tooltip="Optional. Leave empty for manual sync only. Example: 0 0 * * * (daily at midnight)"
          >
            <Input placeholder="0 0 * * *" />
          </Form.Item>

          {editingSyncJob && (
            <Form.Item name="status" label="Status">
              <Select>
                <Select.Option value={SyncJobStatus.IDLE}>Idle</Select.Option>
                <Select.Option value={SyncJobStatus.PAUSED}>Paused</Select.Option>
                <Select.Option value={SyncJobStatus.ERROR}>Error</Select.Option>
              </Select>
            </Form.Item>
          )}
        </Form>
      </Modal>

      {/* Sync Runs Modal */}
      <Modal
        title="Sync Runs"
        open={isRunModalOpen}
        onCancel={() => {
          setIsRunModalOpen(false)
          setSelectedJobId(null)
        }}
        footer={null}
        width={800}
      >
        <Table
          columns={runColumns}
          dataSource={syncRunsData?.items || []}
          loading={syncRunsLoading}
          rowKey="id"
          pagination={{
            current: syncRunsData?.meta.page || 1,
            pageSize: syncRunsData?.meta.take || 10,
            total: syncRunsData?.meta.totalItems || 0,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} runs`,
          }}
          locale={{
            emptyText: (
              <Empty
                description="No sync runs found"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            ),
          }}
        />
      </Modal>
    </Card>
  )
})

SyncSection.displayName = 'SyncSection'

