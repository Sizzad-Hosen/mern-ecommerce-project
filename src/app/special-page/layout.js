// app/special-page/layout.js

export default function SpecialLayout({ children }) {
    return (
      <html lang="en">
        <body>
          <main>{children}</main>
          {/* No Footer */}
        </body>
      </html>
    );
  }
  