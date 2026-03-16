#!/bin/bash
echo "🗄️  Setting up PostgreSQL database..."

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL is not installed."
    echo "   macOS: brew install postgresql"
    echo "   Ubuntu: sudo apt install postgresql postgresql-contrib"
    exit 1
fi

# Create database
echo "Creating database 'designcraft'..."
createdb designcraft 2>/dev/null || echo "Database 'designcraft' already exists"

echo "✅ Database setup complete!"
echo ""
echo "Next steps:"
echo "1. Update .env.local with your DATABASE_URL"
echo "2. Run database migrations when implemented: pnpm --filter=storage migrate"
