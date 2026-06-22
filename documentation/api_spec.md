# Kala Vault API Specifications

## API Design Principles
- REST-first API with strong versioning: `/api/v1/*`
- DTO validation and typed request/response contracts
- Pagination, filtering, sort, and search on list resources
- RBAC and permission guards for admin/customer separation
- Centralized error handling and validation responses

## Authentication

### `POST /api/v1/auth/login`
- Request: `{ email, password }`
- Response: `{ access_token, refresh_token, user }`
- Notes: issue HTTP-only secure refresh cookie, return access token in body

### `POST /api/v1/auth/refresh`
- Request: uses refresh cookie
- Response: `{ access_token }`
- Notes: rotating refresh tokens, revoke on refresh

### `POST /api/v1/auth/logout`
- Request: uses refresh cookie
- Response: `204`

### `POST /api/v1/auth/2fa/verify`
- Request: `{ code }`
- Response: `{ success }`
- Notes: second-factor verification flow

## Users

### `GET /api/v1/users`
- Query params: `page`, `limit`, `role`, `status`, `search`
- Response: paginated user list
- Guard: admin only

### `GET /api/v1/users/me`
- Response: current logged-in profile

### `PATCH /api/v1/users/me`
- Request: profile update DTO

## Roles & Permissions

### `GET /api/v1/roles`
- Response: list of roles with permission sets

### `GET /api/v1/permissions`
- Response: list of available permissions

## Artworks

### `GET /api/v1/artworks`
- Query params: `page`, `limit`, `search`, `category`, `status`, `warehouse_id`, `sort`
- Response: paginated artwork catalog

### `GET /api/v1/artworks/:id`
- Response: artwork detail with image variants

### `POST /api/v1/artworks`
- Request: artwork create DTO
- Guard: admin only

### `PUT /api/v1/artworks/:id`
- Request: artwork update DTO
- Guard: admin only

### `POST /api/v1/artworks/:id/images`
- Request: file upload metadata
- Response: signed upload URL for Cloudflare R2
- Guard: admin only

### `GET /api/v1/artworks/:id/images/:imageId/url`
- Response: signed URL

## Warehouses

### `GET /api/v1/warehouses`
- Response: warehouse list and capacity summary

### `POST /api/v1/warehouses`
- Guard: admin only

## Subscriptions & Billing

### `GET /api/v1/subscriptions`
- Query params: `customer_id`, `status`, `page`, `limit`

### `POST /api/v1/subscriptions`
- Request: `{ customer_id, plan_name, amount_cents, billing_cycle, gst_percentage }`
- Guard: admin only

### `GET /api/v1/invoices`
- Query params: `customer_id`, `status`, `due_date`, `page`, `limit`

### `POST /api/v1/invoices/:id/send`
- Notes: trigger invoice email and webhook sync

### `POST /api/v1/webhooks/razorpay`
- Notes: idempotent webhook handler for payment/invoice/subscription events

## CRM

### `GET /api/v1/crm/leads`
- Query params: `owner_id`, `status`, `source`, `search`, `page`, `limit`

### `POST /api/v1/crm/leads`
- Request: lead create DTO

### `POST /api/v1/crm/leads/:id/activities`
- Request: activity record DTO

## Contracts

### `GET /api/v1/contracts`
- Response: contract list filtered by `status`, `customer_id`, `renewal_date`

### `POST /api/v1/contracts`
- Request: contract creation with template and customer details

### `POST /api/v1/contracts/:id/send`
- Notes: trigger Zoho Sign workflow

### `POST /api/v1/webhooks/zoho-sign`
- Notes: contract signing callback

## Support

### `GET /api/v1/support/tickets`
- Query params: `customer_id`, `status`, `priority`, `page`, `limit`

### `POST /api/v1/support/tickets`
- Request: support ticket create DTO

### `POST /api/v1/support/tickets/:id/reply`
- Request: `{ message }`

## Notifications

### `GET /api/v1/notifications`
- Query params: `user_id`, `is_read`, `page`, `limit`

### `PATCH /api/v1/notifications/:id/read`
- Marks notification read

## Analytics

### `GET /api/v1/admin/analytics/revenue`
- Query params: `from`, `to`

### `GET /api/v1/admin/analytics/inventory`
- Response: inventory health metrics

## Error contract

All API errors follow:
- `{ code, message, details?, traceId? }`

## Pagination contract
- `page`
- `limit`
- `total`
- `items`
