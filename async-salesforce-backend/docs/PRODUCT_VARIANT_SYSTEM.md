# Product Variant System

## Tổng quan

Product Variant System cho phép tạo các biến thể sản phẩm với các thuộc tính khác nhau như màu sắc, kích thước, v.v. Hệ thống bao gồm 4 module chính:

1. **VariantLabel** - Định nghĩa các loại variant (Color, Size, etc.)
2. **VariantOption** - Các option cụ thể (Red, Blue, S, M, L, etc.)
3. **ProductVariant** - Sản phẩm với variant cụ thể
4. **ProductVariantOption** - Liên kết giữa ProductVariant và VariantOption

## Cấu trúc Database

### VariantLabel

- `id`: UUID (Primary Key)
- `name`: Tên variant label (e.g., "Color", "Size")
- `isGlobal`: Boolean - Có phải là global variant label không
- `createdBy`: UUID - ID của user tạo ra variant label
- `createdAt`, `updatedAt`: Timestamp

### VariantOption

- `id`: UUID (Primary Key)
- `name`: Tên variant option (e.g., "Red", "Blue", "S", "M")
- `variantLabelId`: UUID - Foreign key đến VariantLabel
- `createdAt`, `updatedAt`: Timestamp

### ProductVariant

- `id`: UUID (Primary Key)
- `productId`: UUID - Foreign key đến Product
- `sku`: String (Unique) - Mã SKU của variant
- `price`: Decimal - Giá của variant
- `discount`: Decimal - Giảm giá của variant
- `stock`: Integer - Số lượng tồn kho
- `status`: String - Trạng thái variant
- `createdAt`, `updatedAt`: Timestamp

### ProductVariantOption

- `id`: UUID (Primary Key)
- `productVariantId`: UUID - Foreign key đến ProductVariant
- `variantOptionId`: UUID - Foreign key đến VariantOption
- `createdAt`, `updatedAt`: Timestamp

## API Endpoints

### VariantLabel

#### Tạo variant label

```http
POST /variant-labels
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Color",
  "isGlobal": true
}
```

#### Lấy danh sách variant labels

```http
GET /variant-labels
```

#### Lấy variant label theo ID

```http
GET /variant-labels/:id
```

#### Cập nhật variant label

```http
PUT /variant-labels/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Size",
  "isGlobal": false
}
```

#### Xóa variant label

```http
DELETE /variant-labels/:id
Authorization: Bearer <token>
```

### VariantOption

#### Tạo variant option

```http
POST /variant-options
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Red",
  "variantLabelId": "123e4567-e89b-12d3-a456-426614174000"
}
```

#### Lấy danh sách variant options

```http
GET /variant-options
```

#### Lấy variant options theo variant label

```http
GET /variant-options/variant-label/:variantLabelId
```

#### Lấy variant option theo ID

```http
GET /variant-options/:id
```

#### Cập nhật variant option

```http
PUT /variant-options/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Blue",
  "variantLabelId": "123e4567-e89b-12d3-a456-426614174000"
}
```

#### Xóa variant option

```http
DELETE /variant-options/:id
Authorization: Bearer <token>
```

### ProductVariant

#### Tạo product variant

```http
POST /product-variants
Authorization: Bearer <token>
Content-Type: application/json

{
  "productId": "123e4567-e89b-12d3-a456-426614174000",
  "sku": "PROD-001-RED-M",
  "price": 100000,
  "discount": 10000,
  "stock": 100,
  "status": "active",
  "variantOptionIds": [
    "123e4567-e89b-12d3-a456-426614174000",
    "123e4567-e89b-12d3-a456-426614174001"
  ]
}
```

#### Lấy danh sách product variants

```http
GET /product-variants
```

#### Lấy product variants theo product

```http
GET /product-variants/product/:productId
```

#### Lấy product variant theo ID

```http
GET /product-variants/:id
```

#### Cập nhật product variant

```http
PUT /product-variants/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "sku": "PROD-001-BLUE-L",
  "price": 120000,
  "stock": 50,
  "variantOptionIds": [
    "123e4567-e89b-12d3-a456-426614174002",
    "123e4567-e89b-12d3-a456-426614174003"
  ]
}
```

#### Xóa product variant

```http
DELETE /product-variants/:id
Authorization: Bearer <token>
```

## Ví dụ sử dụng

### 1. Tạo variant label cho màu sắc

```json
{
  "name": "Color",
  "isGlobal": true
}
```

### 2. Tạo các variant options cho màu sắc

```json
[
  {
    "name": "Red",
    "variantLabelId": "color-label-id"
  },
  {
    "name": "Blue",
    "variantLabelId": "color-label-id"
  },
  {
    "name": "Green",
    "variantLabelId": "color-label-id"
  }
]
```

### 3. Tạo variant label cho kích thước

```json
{
  "name": "Size",
  "isGlobal": true
}
```

### 4. Tạo các variant options cho kích thước

```json
[
  {
    "name": "S",
    "variantLabelId": "size-label-id"
  },
  {
    "name": "M",
    "variantLabelId": "size-label-id"
  },
  {
    "name": "L",
    "variantLabelId": "size-label-id"
  }
]
```

### 5. Tạo product variant với màu đỏ và size M

```json
{
  "productId": "product-id",
  "sku": "PROD-001-RED-M",
  "price": 100000,
  "discount": 10000,
  "stock": 100,
  "status": "active",
  "variantOptionIds": ["red-option-id", "m-size-option-id"]
}
```

## Lưu ý

1. **SKU Unique**: Mỗi product variant phải có SKU duy nhất
2. **Cascade Delete**: Khi xóa variant label, tất cả variant options sẽ bị xóa
3. **Cascade Delete**: Khi xóa product, tất cả product variants sẽ bị xóa
4. **Cascade Delete**: Khi xóa product variant, tất cả product variant options sẽ bị xóa
5. **Optional Product Variant**: Order item có thể có hoặc không có product variant
