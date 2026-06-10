import { CheckCircle2Icon, InfoIcon } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export const InfoAlert = () => {
  return (
    <div className="flex max-w-md">
      <Alert variant="info">
        <InfoIcon />
        <AlertTitle>Payment successful</AlertTitle>
        <AlertDescription>
          Your payment of $29.99 has been processed. A receipt has been sent to
          your email address.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export const SuccessAlert = () => {
  return (
    <Alert>
      <CheckCircle2Icon />
      <AlertTitle>Payment successful</AlertTitle>
      <AlertDescription>
        Your payment of $29.99 has been processed. A receipt has been sent to
        your email address.
      </AlertDescription>
    </Alert>
  );
};
