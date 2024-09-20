declare global {
  namespace Vike {
    interface PageContext {
      locale: string;
      urlLogical: string;
    }
  }
}

// Make sure there is at least one export/import statement.
// Tell TypeScript this file isn't an ambient module:
export {};
