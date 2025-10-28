# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Structure

This is a monorepo project managed with pnpm:
- `apps/` - Application packages (currently empty)
- `packages/` - Shared library packages (currently empty)

## Package Manager

This project uses pnpm 10.10.0. All package management commands should use pnpm:
- `pnpm install` - Install dependencies
- `pnpm add <package>` - Add a dependency
- `pnpm remove <package>` - Remove a dependency

## Development Setup

The project is in initial setup phase. When adding workspaces:
1. Create a `pnpm-workspace.yaml` file to define workspace packages
2. Add package.json files in apps/ and packages/ subdirectories
3. Configure build tools (e.g., turbo, nx) if needed for monorepo orchestration