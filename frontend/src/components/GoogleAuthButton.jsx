import { GoogleLogin } from "@react-oauth/google";

export default function GoogleAuthButton({ onSuccess, onError, label }) {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;


  if (!clientId) {
    return (
      <button
        type="button"
        disabled
        title="Set VITE_GOOGLE_CLIENT_ID to enable Google sign-in"
        className="btn-ghost w-full cursor-not-allowed opacity-60"
      >
        <GoogleIcon />
        {label || "Continue with Google"}
        <span className="ml-1 text-[11px] text-ink-400">(not configured)</span>
      </button>
    );
  }

  return (
    <div className="w-full">
      <GoogleLogin
        onSuccess={(response) => onSuccess?.(response.credential)}
        onError={() => onError?.(new Error("Google sign-in was cancelled"))}
        text="continue_with"
        theme="outline"
        size="large"
        shape="rectangular"
        width="100%"
      />
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path
        fill="#EA4335"
        d="M12 10.2v3.96h5.52c-.24 1.44-1.68 4.2-5.52 4.2-3.36 0-6.06-2.76-6.06-6.18S8.64 6 12 6c1.92 0 3.18.84 3.9 1.5l2.64-2.52C16.86 3.42 14.64 2.4 12 2.4 6.6 2.4 2.4 6.6 2.4 12s4.2 9.6 9.6 9.6c5.52 0 9.18-3.9 9.18-9.36 0-.66-.06-1.14-.18-1.62H12z"
      />
    </svg>
  );
}
