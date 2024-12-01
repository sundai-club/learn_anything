import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background-light to-surface-light dark:from-background-dark dark:to-surface-dark">
      <SignUp
        appearance={{
          elements: {
            formButtonPrimary:
              "bg-primary-light dark:bg-primary-dark hover:opacity-90",
            card: "bg-surface-light dark:bg-surface-dark",
          },
        }}
      />
    </div>
  );
}
