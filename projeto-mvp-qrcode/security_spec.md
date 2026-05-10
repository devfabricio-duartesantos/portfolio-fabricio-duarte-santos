# Firebase Security Specification

## Data Invariants
1. **User Identity Isolation**: Users can only access their own profile data (`/users/{userId}`).
2. **Resource Ownership**: Users can only read, create, update, or delete QR codes they created (`/qrcodes/{qrcodeId}` where `createdBy == request.auth.uid`).
3. **Role Protection**: The `role` field in a user profile is immutable by the user. Only a bootstrapped logic or admin can modify roles.
4. **Admin Oversight**: Admins (defined in an `admins` collection or by field check) can read all data but not necessarily modify others' QR codes unless specified.
5. **Temporal Integrity**: `createdAt` must be set to `request.time` and remains immutable.

## The Dirty Dozen (Attack Payloads)
1. **Privilege Escalation**: User `user123` tries to `update` `/users/user123` with `{ "role": "admin" }`.
2. **Cross-User Profile Read**: User `user123` tries to `get` `/users/otherUser456`.
3. **Identity Spoofing (Create)**: User `user123` tries to `create` `/qrcodes/qr789` with `{ "createdBy": "otherUser456" }`.
4. **Identity Spoofing (Update)**: User `user123` tries to `update` `/qrcodes/qr789` (their own) with `{ "createdBy": "otherUser456" }`.
5. **Resource Theft**: User `user123` tries to `update` or `delete` `/qrcodes/qr_belonging_to_456`.
6. **Bulk Data Scraping**: User `user123` tries to `list` `/qrcodes` without a filter on `createdBy`.
7. **Temporal Tampering**: User `user123` tries to set `createdAt` to a date in 1990.
8. **Shadow Field Injection**: User `user123` tries to add a `ghost_field` to a QR code document.
9. **Admin Collection Probe**: User `user123` tries to `create` themselves in a hypothetical `/admins` collection.
10. **Resource Exhaustion**: User `user123` tries to save a 5MB string in the `data` field of a QR code.
11. **Doc ID Poisoning**: User `user123` tries to create a document with an ID containing `../secret/doc`.
12. **Unverified Access**: User with `email_verified: false` tries to `create` a QR code.

## Test Runner (Draft)
A `firestore.rules.test.ts` will be implemented to verify these denials.
