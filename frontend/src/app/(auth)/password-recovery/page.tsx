import { Suspense } from "react";
import RecoveryComp from "./RecoveryComp";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RecoveryComp />
    </Suspense>
  );
}
