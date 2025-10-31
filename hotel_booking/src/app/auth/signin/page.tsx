import SignInForm from "@/components/auth/SignInForm";

export default function SignInPage() {
  return (
    <>
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12">
        <SignInForm />
      </main>
    </>
  );
}