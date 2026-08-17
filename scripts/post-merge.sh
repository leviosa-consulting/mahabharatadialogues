#!/bin/bash
set -e

# Clear all stale Next.js compiled output after every task merge.
# The dev server recompiles automatically on first request.
echo "Clearing stale .next build cache..."
rm -rf .next
echo "Done."
