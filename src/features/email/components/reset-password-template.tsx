export const ResetPasswordTemplate = ({ url }: { url: string }) => {
  return (
    <div>
      <h1>Reset Password</h1>
      <p>Click the link to reset your password: {url}</p>
    </div>
  );
};
