#!/bin/bash

# DesignCraft Platform Setup Script
# This script helps you set up the development environment

set -e

echo "🚀 DesignCraft Platform Setup"
echo "============================"

# Check prerequisites
echo "📋 Checking prerequisites..."

# Check Node.js version
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "   Download from: https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version $NODE_VERSION detected. Please upgrade to Node.js 18+"
    exit 1
fi
echo "✅ Node.js version: $(node -v)"

# Check pnpm version
if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm is not installed. Installing pnpm..."
    npm install -g pnpm
fi

PNPM_VERSION=$(pnpm -v)
echo "✅ pnpm version: $PNPM_VERSION"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
pnpm install

# Verify installation
echo ""
echo "🔍 Verifying installation..."
echo "Checking workspace links..."
pnpm list --depth=0 | grep -E "(designcraft|workspace)" || echo "⚠️  Some workspace packages may not be linked"

echo "Running TypeScript check..."
pnpm typecheck || echo "⚠️  TypeScript errors detected - check output above"

# Create environment file template
echo ""
echo "📝 Creating environment configuration template..."
if [ ! -f ".env.local" ]; then
    cat > .env.local << 'EOF'
# Database Configuration
# DATABASE_URL="postgresql://user:password@localhost:5432/designcraft"

# AI Configuration (Optional for basic functionality)
# CLAUDE_API_KEY="your-claude-api-key"
# CLAUDE_API_URL="https://api.anthropic.com"

# Storage Configuration (Optional for basic functionality)
# AWS_ACCESS_KEY_ID="your-aws-key"
# AWS_SECRET_ACCESS_KEY="your-aws-secret"
# S3_BUCKET_NAME="designcraft-assets"
EOF
    echo "✅ Created .env.local template"
    echo "   Edit this file to add your configuration"
else
    echo "✅ .env.local already exists"
fi

# Create database setup script
echo ""
echo "🗄️  Creating database setup script..."
cat > setup-database.sh << 'EOF'
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
EOF

chmod +x setup-database.sh
echo "✅ Created setup-database.sh script"

# Final instructions
echo ""
echo "🎉 Setup Complete!"
echo "=================="
echo ""
echo "📋 Next Steps:"
echo "1. Start development servers: pnpm dev"
echo "2. Or start individual apps:"
echo "   - Editor: pnpm --filter=editor dev"
echo "   - Renderer: pnpm --filter=renderer dev"
echo ""
echo "3. Optional: Set up database"
echo "   ./setup-database.sh"
echo ""
echo "4. Optional: Configure environment variables in .env.local"
echo ""
echo "📚 Useful Commands:"
echo "   pnpm build          # Build all packages and apps"
echo "   pnpm lint           # Run linting"
echo "   pnpm format         # Format code"
echo "   pnpm typecheck      # Check TypeScript"
echo ""
echo "🔗 Documentation:"
echo "   README.md              # Main documentation"
echo "   ARCHITECTURE_SUMMARY.md # Architecture overview"
echo "   REPOSITORY_STRUCTURE.md # File structure"
echo ""
echo "Happy coding! 🚀"