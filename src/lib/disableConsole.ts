// src/lib/disableConsole.ts
export function disableConsoleInProduction() {
  if (process.env.NODE_ENV === 'production') {
    // Nonaktifkan semua method console
    const noop = () => {};
    console.log = noop;
    console.warn = noop;
    console.error = noop;
    console.info = noop;
    console.debug = noop;

    // Cegah error global muncul di console
    window.addEventListener('error', (event) => {
      event.preventDefault();
      return false;
    });

    // Cegah unhandled promise rejection muncul di console
    window.addEventListener('unhandledrejection', (event) => {
      event.preventDefault();
      return false;
    });
  }
}
