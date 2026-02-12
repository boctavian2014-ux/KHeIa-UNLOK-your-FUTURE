# Offline Sync

The app uses WatermelonDB with a pull-push sync flow.

- Pull changes from Supabase on connectivity restore.
- Push local changes queued while offline.
- Fallback JSON files under `assets/offline-data/` for first launch.
