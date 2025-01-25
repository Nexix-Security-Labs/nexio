"use client";

// ui
import { Button } from "@plane/ui";

const ErrorPage = () => {
  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="grid h-screen place-items-center p-4">
      <div className="space-y-8 text-center">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Yikes! That doesn{"'"}t look good.</h3>
          <p className="mx-auto md:w-1/2 text-sm text-custom-text-200">
            That crashed Nexio, pun intended. No worries, though. Our engineers have been notified. If you have more
            details, please write to{" "}
            <a href="mailto:support-nexio@nexixsecuritylabs.com" className="text-custom-primary">
            support-nexio@nexixsecuritylabs.com
            </a>{" "}
            or on our{" "}
            <a
              href="https://nsl-assetsecure-support.zapier.app/"
              target="_blank"
              className="text-custom-primary"
              rel="noopener noreferrer"
            >
              Portal
            </a>
            .
          </p>
        </div>
        <div className="flex items-center justify-center gap-2">
          <Button variant="primary" size="md" onClick={handleRetry}>
            Refresh
          </Button>
          {/* <Button variant="neutral-primary" size="md" onClick={() => {}}>
            Sign out
          </Button> */}
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
