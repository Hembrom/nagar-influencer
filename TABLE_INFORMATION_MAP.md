# Database Table Information Map

## 📊 Complete Information Architecture

| Information | Table | Column Name | Type | Notes |
|-------------|-------|------------|------|-------|
| **INFLUENCER DATA** | | | | |
| Influencer ID | influencers | id | UUID | Primary Key |
| Name | influencers | name | VARCHAR(255) | Creator's full name |
| Email | influencers | email | VARCHAR(255) | Unique, used for login |
| Handle/Username | influencers | handle | VARCHAR(255) | @username format |
| Profile Photo | influencers | profile_photo | TEXT | URL to photo |
| Bio | influencers | bio | TEXT | Creator description |
| Location | influencers | location | VARCHAR(255) | City/Region |
| Category/Niche | influencers | category | VARCHAR(255) | Beauty, Food, Tech, etc. |
| Followers Count | influencers | followers | VARCHAR(50) | e.g., "1.2M" |
| Audience Size | influencers | audience_size | VARCHAR(50) | 50K, 100K, 1M, etc. |
| Instagram URL | influencers | instagram_url | TEXT | Social media link |
| YouTube URL | influencers | youtube_url | TEXT | Social media link |
| TikTok URL | influencers | tiktok_url | TEXT | Social media link |
| Portfolio Links | influencers | portfolio_links | TEXT[] | Array of URLs |
| Collaboration Interests | influencers | collaboration_interests | TEXT | What they're interested in |
| Source | influencers | source | TEXT | 'self-registered' or 'admin-added' |
| Status | influencers | status | VARCHAR(50) | verified, pending, inactive |
| Registration Date | influencers | created_at | TIMESTAMP | When registered |
| Last Updated | influencers | updated_at | TIMESTAMP | Last modification date |
| | | | | |
| **CLIENT/BRAND DATA** | | | | |
| Client ID | clients | id | UUID | Primary Key |
| Brand Name | clients | name | VARCHAR(255) | Company name |
| Email | clients | email | VARCHAR(255) | Unique contact email |
| Contact Person | clients | contact_person | VARCHAR(255) | Primary contact name |
| Phone | clients | phone | VARCHAR(20) | Phone number |
| Website | clients | company_website | VARCHAR(255) | Brand website URL |
| Logo | clients | logo_url | TEXT | Brand logo image URL |
| Category | clients | category | VARCHAR(255) | Industry/niche |
| Location | clients | location | VARCHAR(255) | Brand location |
| Bio/Description | clients | bio | TEXT | About the brand |
| Plan | clients | plan | VARCHAR(50) | free, starter, pro, enterprise |
| Status | clients | status | VARCHAR(50) | active, inactive, suspended |
| Total Campaigns | clients | total_campaigns_created | INTEGER | Number of campaigns created |
| Total Spent | clients | total_spent | NUMERIC(12,2) | Total money spent (₹) |
| Registration Date | clients | created_at | TIMESTAMP | When registered |
| Last Updated | clients | updated_at | TIMESTAMP | Last modification |
| | | | | |
| **ADMIN DATA** | | | | |
| Admin ID | admins | id | UUID | Primary Key |
| Username | admins | username | VARCHAR(255) | Unique login username |
| Email | admins | email | VARCHAR(255) | Unique admin email |
| Password Hash | admins | password_hash | VARCHAR(255) | Encrypted password |
| Full Name | admins | full_name | VARCHAR(255) | Admin's name |
| Phone | admins | phone | VARCHAR(20) | Contact phone |
| Role | admins | role | VARCHAR(50) | admin, superadmin, moderator |
| Status | admins | status | VARCHAR(50) | active, inactive |
| Assigned Regions | admins | assigned_regions | TEXT | Cities/regions they manage |
| Permissions | admins | permissions | TEXT[] | Array of permissions |
| Campaigns Handled | admins | campaigns_handled | INTEGER | Count of campaigns |
| Clients Managed | admins | clients_managed | INTEGER | Count of clients |
| Created Date | admins | created_at | TIMESTAMP | When account created |
| Last Updated | admins | updated_at | TIMESTAMP | Last update |
| | | | | |
| **CAMPAIGN DATA** | | | | |
| Campaign ID | campaigns | id | UUID | Primary Key |
| Client ID (Foreign Key) | campaigns | client_id | UUID | References clients(id) |
| Title | campaigns | title | VARCHAR(255) | Campaign name |
| Description | campaigns | description | TEXT | Campaign brief |
| Category | campaigns | category | VARCHAR(255) | Industry category |
| Niche | campaigns | niche | VARCHAR(255) | Target niche |
| Content Format | campaigns | content_format | VARCHAR(255) | Instagram Reel, YouTube, etc. |
| Status | campaigns | status | VARCHAR(50) | draft, shortlisting, negotiating, live, completed, cancelled |
| Min Budget | campaigns | budget_min | NUMERIC(12,2) | Minimum budget (₹) |
| Max Budget | campaigns | budget_max | NUMERIC(12,2) | Maximum budget (₹) |
| Booking Token | campaigns | booking_token | NUMERIC(12,2) | ₹500 payment amount |
| Total Budget | campaigns | total_budget | NUMERIC(12,2) | Total campaign cost |
| Start Date | campaigns | start_date | DATE | Campaign start date |
| End Date | campaigns | end_date | DATE | Campaign end date |
| Target Audience | campaigns | target_audience | TEXT | Who to reach |
| Target Location | campaigns | location | VARCHAR(255) | Geographic location |
| Target Language | campaigns | language | VARCHAR(255) | Language preference |
| Min Followers Required | campaigns | min_followers | VARCHAR(50) | e.g., "100K+" |
| Min Engagement Rate | campaigns | min_engagement_rate | NUMERIC(5,2) | e.g., 4.5% |
| Number of Creators | campaigns | number_of_creators | INTEGER | How many influencers needed |
| Deliverables | campaigns | deliverables | TEXT | What's expected |
| Assigned Admin ID | campaigns | assigned_admin_id | UUID | References admins(id) |
| Created Date | campaigns | created_at | TIMESTAMP | When created |
| Updated Date | campaigns | updated_at | TIMESTAMP | Last update |
| | | | | |
| **APPLICATION DATA** | | | | |
| Application ID | campaign_applications | id | UUID | Primary Key |
| Campaign ID (Foreign Key) | campaign_applications | campaign_id | UUID | References campaigns(id) |
| Influencer ID (Foreign Key) | campaign_applications | influencer_id | UUID | References influencers(id) |
| Status | campaign_applications | status | VARCHAR(50) | pending, accepted, rejected, withdrawn |
| Proposal Text | campaign_applications | proposal_text | TEXT | Influencer's pitch |
| Quoted Rate | campaign_applications | quoted_rate | NUMERIC(12,2) | Price the influencer quoted |
| Applied Date | campaign_applications | applied_at | TIMESTAMP | When they applied |
| Responded Date | campaign_applications | responded_at | TIMESTAMP | When admin responded |
| | | | | |
| **DELIVERABLE DATA** | | | | |
| Deliverable ID | deliverables | id | UUID | Primary Key |
| Campaign ID (Foreign Key) | deliverables | campaign_id | UUID | References campaigns(id) |
| Influencer ID (Foreign Key) | deliverables | influencer_id | UUID | References influencers(id) |
| Title | deliverables | title | VARCHAR(255) | Deliverable name |
| Description | deliverables | description | TEXT | What was delivered |
| Format | deliverables | format | VARCHAR(255) | Instagram Reel, YouTube, etc. |
| Content URL | deliverables | content_url | TEXT | Link to the content |
| Media URL | deliverables | media_url | TEXT | Direct media file URL |
| Views | deliverables | views | INTEGER | Number of views |
| Engagement Count | deliverables | engagement | INTEGER | Total engagements |
| Likes | deliverables | likes | INTEGER | Number of likes |
| Comments | deliverables | comments | INTEGER | Number of comments |
| Shares | deliverables | shares | INTEGER | Number of shares |
| Status | deliverables | status | VARCHAR(50) | pending, submitted, approved, rejected, published |
| Submission Date | deliverables | submission_date | TIMESTAMP | When submitted |
| Approval Date | deliverables | approval_date | TIMESTAMP | When approved |
| Amount Due | deliverables | amount_due | NUMERIC(12,2) | Payment amount (₹) |
| Amount Paid | deliverables | amount_paid | NUMERIC(12,2) | Amount received (₹) |
| Payment Status | deliverables | payment_status | VARCHAR(50) | pending, partial, completed |
| Created Date | deliverables | created_at | TIMESTAMP | When created |
| Updated Date | deliverables | updated_at | TIMESTAMP | Last update |
| | | | | |
| **TRANSACTION DATA** | | | | |
| Transaction ID | transactions | id | UUID | Primary Key |
| Type | transactions | transaction_type | VARCHAR(50) | booking_token, campaign_payment, refund, platform_fee |
| Campaign ID (Foreign Key) | transactions | campaign_id | UUID | References campaigns(id) |
| Influencer ID (Foreign Key) | transactions | influencer_id | UUID | References influencers(id) |
| Client ID (Foreign Key) | transactions | client_id | UUID | References clients(id) |
| Amount | transactions | amount | NUMERIC(12,2) | Money amount (₹) |
| Currency | transactions | currency | VARCHAR(3) | INR (default) |
| Status | transactions | status | VARCHAR(50) | pending, completed, failed, refunded |
| Payment Method | transactions | payment_method | VARCHAR(50) | Credit card, bank, UPI, etc. |
| Transaction Reference | transactions | transaction_id | VARCHAR(255) | Payment gateway transaction ID |
| Receipt URL | transactions | receipt_url | TEXT | Receipt link |
| Description | transactions | description | TEXT | What payment is for |
| Notes | transactions | notes | TEXT | Additional notes |
| Created Date | transactions | created_at | TIMESTAMP | When payment made |
| Completed Date | transactions | completed_at | TIMESTAMP | When completed |
| | | | | |
| **MESSAGE DATA** | | | | |
| Message ID | messages | id | UUID | Primary Key |
| Campaign ID (Foreign Key) | messages | campaign_id | UUID | References campaigns(id) |
| Sender ID | messages | sender_id | UUID | User ID who sent |
| Sender Type | messages | sender_type | VARCHAR(50) | influencer, client, admin |
| Recipient ID | messages | recipient_id | UUID | User ID who receives |
| Recipient Type | messages | recipient_type | VARCHAR(50) | influencer, client, admin |
| Content | messages | content | TEXT | Message text |
| Message Type | messages | message_type | VARCHAR(50) | text, file, image, video |
| Attachment URL | messages | attachment_url | TEXT | File/image/video URL |
| Is Read | messages | is_read | BOOLEAN | Whether message is read |
| Read Date | messages | read_at | TIMESTAMP | When message was read |
| Created Date | messages | created_at | TIMESTAMP | When sent |
| Updated Date | messages | updated_at | TIMESTAMP | Last update |
| | | | | |
| **REVIEW DATA** | | | | |
| Review ID | reviews | id | UUID | Primary Key |
| Campaign ID (Foreign Key) | reviews | campaign_id | UUID | References campaigns(id) |
| Reviewer ID | reviews | reviewer_id | UUID | Who left the review |
| Reviewer Type | reviews | reviewer_type | VARCHAR(50) | influencer or client |
| Recipient ID | reviews | recipient_id | UUID | Who is being reviewed |
| Rating | reviews | rating | NUMERIC(2,1) | 1-5 stars |
| Comment | reviews | comment | TEXT | Review text |
| Created Date | reviews | created_at | TIMESTAMP | When reviewed |
| Updated Date | reviews | updated_at | TIMESTAMP | Last update |
| | | | | |
| **ANALYTICS DATA** | | | | |
| Analytics ID | analytics | id | UUID | Primary Key |
| Campaign ID (Foreign Key) | analytics | campaign_id | UUID | References campaigns(id) |
| Influencer ID (Foreign Key) | analytics | influencer_id | UUID | References influencers(id) |
| Date | analytics | date | DATE | Analytics date |
| Total Reach | analytics | total_reach | INTEGER | How many people reached |
| Total Impressions | analytics | total_impressions | INTEGER | Number of impressions |
| Total Clicks | analytics | total_clicks | INTEGER | Number of clicks |
| Total Conversions | analytics | total_conversions | INTEGER | Sales/conversions |
| Engagement Rate | analytics | engagement_rate | NUMERIC(5,2) | Percentage of engagement |
| Created Date | analytics | created_at | TIMESTAMP | When recorded |

---

## 🎯 **Quick Reference by User Type**

### **For INFLUENCERS**
Tables: `influencers`, `campaign_applications`, `deliverables`, `messages`, `transactions`, `reviews`

### **For CLIENTS**
Tables: `clients`, `campaigns`, `deliverables`, `transactions`, `messages`, `reviews`

### **For ADMINS**
Tables: `admins`, `campaigns`, `campaign_applications`, `messages`, `transactions`

### **For ANALYTICS**
Tables: `analytics`, `deliverables`, `campaigns`

---

## 📋 **Data Flow**

```
1. Client registers → clients table
2. Admin creates campaign → campaigns table
3. Admin shortlists influencers → campaign_applications table
4. Admin messages influencer → messages table
5. Influencer applies → campaign_applications (update)
6. Campaign goes live → campaigns (status update)
7. Influencer delivers content → deliverables table
8. Payment made → transactions table
9. Content tracked → analytics table
10. Review left → reviews table
```

---

Done! Every piece of information mapped to its table. 🎉
