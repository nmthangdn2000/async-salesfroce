# API Documentation

## Product Variant System

### Variant Labels

#### Create Variant Label

```http
POST /variant-labels
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Color",
  "isGlobal": true
}
```

#### Get All Variant Labels

```http
GET /variant-labels
```

#### Get Variant Label by ID

```http
GET /variant-labels/:id
```

#### Update Variant Label

```http
PUT /variant-labels/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Size",
  "isGlobal": false
}
```

#### Delete Variant Label

```http
DELETE /variant-labels/:id
Authorization: Bearer <token>
```

### Variant Options

#### Create Variant Option

```http
POST /variant-options
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Red",
  "variantLabelId": "123e4567-e89b-12d3-a456-426614174000",
  "value": "Red",
  "valueType": "string"
}
```

#### Get All Variant Options

```http
GET /variant-options
```

#### Get Variant Options by Variant Label

```http
GET /variant-options/variant-label/:variantLabelId
```

#### Get Variant Option by ID

```http
GET /variant-options/:id
```

#### Update Variant Option

```http
PUT /variant-options/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Blue",
  "variantLabelId": "123e4567-e89b-12d3-a456-426614174000",
  "value": "Blue",
  "valueType": "string"
}
```

#### Delete Variant Option

```http
DELETE /variant-options/:id
Authorization: Bearer <token>
```

### Product Variants

#### Create Product Variant

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

#### Get All Product Variants

```http
GET /product-variants
```

#### Get Product Variants by Product ID

```http
GET /product-variants/product/:productId
```

#### Get Product Variant by ID

```http
GET /product-variants/:id
```

#### Update Product Variant

```http
PUT /product-variants/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "sku": "PROD-001-BLUE-L",
  "price": 120000,
  "stock": 50,
  "status": "active",
  "variantOptionIds": [
    "123e4567-e89b-12d3-a456-426614174002",
    "123e4567-e89b-12d3-a456-426614174003"
  ]
}
```

#### Delete Product Variant

```http
DELETE /product-variants/:id
Authorization: Bearer <token>
```

## Response Format

All API responses follow this format:

```json
{
  "success": true,
  "message": "Success",
  "data": {
    // Response data here
  }
}
```

## Error Response Format

```json
{
  "success": false,
  "message": "Error message",
  "error": {
    "code": 1001,
    "details": "Additional error details"
  }
}
```

## Authentication

Most endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Data Types

### Variant Label

- `id`: UUID
- `name`: String
- `isGlobal`: Boolean
- `createdBy`: UUID
- `createdAt`: Date
- `updatedAt`: Date

### Variant Option

- `id`: UUID
- `name`: String
- `variantLabelId`: UUID
- `value`: String
- `valueType`: Enum (string, number, boolean)
- `createdAt`: Date
- `updatedAt`: Date

### Product Variant

- `id`: UUID
- `productId`: UUID
- `sku`: String (unique)
- `price`: Number
- `discount`: Number (optional)
- `stock`: Number
- `status`: Enum (active, inactive, out_of_stock)
- `createdAt`: Date
- `updatedAt`: Date

### Product Variant Option

- `id`: UUID
- `productVariantId`: UUID
- `variantOptionId`: UUID
- `createdAt`: Date
- `updatedAt`: Date
