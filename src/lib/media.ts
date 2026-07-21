/**
 * Media storage abstraction.
 *
 * Milestone 1 stores uploaded files on local disk under /public/uploads and
 * returns a public URL. The interface is deliberately storage-agnostic so a
 * future milestone can swap in an S3-compatible provider (e.g. AWS S3,
 * Cloudflare R2, MinIO) by implementing the same MediaStorage contract,
 * without any calling code needing to change.
 */

export interface MediaStorage {
  /** Upload a file and return its publicly accessible URL. */
  upload(file: File, folder: string): Promise<string>;
}

class LocalMediaStorage implements MediaStorage {
  async upload(_file: File, _folder: string): Promise<string> {
    // Placeholder implementation for Milestone 1. Real disk-write handling
    // will be wired up alongside the profile photo upload UI in a future
    // milestone. For now this keeps the abstraction in place.
    throw new Error('Local media upload not yet implemented — architecture placeholder.');
  }
}

export const mediaStorage: MediaStorage = new LocalMediaStorage();
