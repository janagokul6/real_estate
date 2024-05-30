# Real Estate Management System

The Real Estate Management System is a web application designed to streamline property management processes. It also offers various services related to real estate and provides ease while maintaining the business.

## Technologies Used

- Node.js
- Express.js
- MongoDB
- Mongoose
- AWS S3 (for image storage)
- HTML, CSS, JavaScript (Frontend)
- Bootstrap (Frontend UI framework)

## Modules


`Users(Agent/contractor)`
- Create User
- Get User(for profile section)
- Update user(from profile section)


`Tenants`
- Create Tenant(by Agent)
- Get Tenant(by Agent)
- Get All Tenants(by Agent)
- Update Tenant(by Agent)
- Delete Tenant(by Agent)


`Documents`
- Create Document(by Agent, for tenant, like contact, lease and rent agreements)
- Get Document(by Agent)
- Get All Documents(by Agent)
- Update Document(by Agent, for tenant)
- Delete Document(by Agent, for tenant)


`Properties`
- Add Property(by Agent)
- Get Property(by Agent)
- Get All Properties(by Agent)
- Update Property(by Agent, like status(sold/available etc))
- Delete Property(by Agent)


`Rents`
- Create Rent(For a tenant)
- Get Rent(For a tenant)
- Get All Properties(For a tenant)
- Update Rent(For a tenant, like status(paid))


`Maintenances`
- Add Maintenance(by Agent)
- Get Maintenance(by Agent)
- Get All Maintenances(by Agent)
- Update Maintenance(by Agent, like status(sold/available etc))
- Delete Maintenance(by Agent)


`Expenses`
- Create/Generate Expense(by Agent, for actions like maintenance, repairs, etc.)
- Get Expense(by Agent)
- Get All Expenses(by Agent)


`Financial Reports`
- Create/Generate Financial Report(by Agent, for values like profit/loss statements, balance sheets, and cash flow analysis etc, between some interval of time)
- Get Financial Report(by Agent)
- Get All Financial Reports(by Agent)


`KPIs(Key Performance Indicators)`
- Create KPI(By Agent, for occurances like "Occupancy Rate", "Rental Income", "Maintenance Costs" and for a specific time period)
- Get KPI(By Agent)
- Get All KPI(By Agent, in order to evalute the performance of the organisation)
