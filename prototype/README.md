<h1 align="center">Nexa Prototype using Medusa 2.0</h1>

This prototype was built using Medusa 2.0 and Next.js. It is a simple e-commerce platform that allows users to browse products, filter by size, add them to their cart, and checkout. The Medusa admin can be used to manage products, orders, and shipping methods and much more.

The initial starting point was: https://github.com/Agilo/fashion-starter

For technical support or any questions, please email: bone-winkel@campus.tu-berlin.de

## Prerequisites
- Node >= 20
- Yarn >= 3.5
- Docker and Docker Compose

## Quickstart
Tested on MacOS and Ubuntu 24.04.
Not recommended. This script is for convenience and may not work on all systems.
Go to the next section for a more detailed setup.

```bash
chmod +x ./start.sh
./start.sh
```

### Medusa

```bash
cd medusa

# Create the .env file
cp .env.template .env

# Install dependencies
yarn

# Spin up the database and Redis
docker-compose -p medusa_dev up -d

# Restore the postgres database from the backup
docker exec -i medusa_dev-postgres-1 psql -U postgres -d medusa < ./medusa_db_backup.sql

# Build the project
yarn build

# Start the development server
yarn dev
```

At this point, you should be able to access the Medusa admin at http://localhost:9000/app with the credentials you just created. After logging in, you should go to http://localhost:9000/app/settings/publishable-api-keys, copy the publishable key, and paste it into the `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` env variable in the `storefront/.env.local` file.

### Storefront

```bash
cd storefront

# Create the .env.local file
cp .env.template .env.local

# Install dependencies
yarn

# Start the development server
yarn dev
```

You should now be able to access the storefront at http://localhost:8000.
