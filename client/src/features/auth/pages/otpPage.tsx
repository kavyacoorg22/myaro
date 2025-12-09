import React from "react";

interface OtpUIProps {
  otp: string[];
  error: string;
  timer: number;
  email:string
  signupToken:string
  handleChange: (index: number, value: string) => void;
  handleKeyDown: (index: number, e: React.KeyboardEvent<HTMLInputElement>) => void;
  handlePaste: (e: React.ClipboardEvent) => void;
  handleResend: () => void;
  handleSubmit: (e: React.FormEvent) => void;

  inputRefs: React.MutableRefObject<(HTMLInputElement | null)[]>;
}

function maskEmail(email: string): string {
  const [name, domain] = email.split("@");
  if (!name || !domain) return email;

  const visible = name.slice(0, 4);         
  const masked = "*".repeat(Math.max(name.length - 2, 1));

  return `${visible}${masked}@${domain}`;
}

const OtpUI: React.FC<OtpUIProps> = ({
  otp,
  error,
  timer,
  handleChange,
  handleKeyDown,
  handlePaste,
  handleResend,
  handleSubmit,
  inputRefs,
  email,
  signupToken
}) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 w-full max-w-md">

        <h1 className="text-2xl font-semibold text-gray-900 text-center mb-6">
          Enter OTP
        </h1>

        <p className="text-sm text-gray-600 text-center mb-8">
          Enter the 4-digit code sent to your{" "}
          <span className="text-gray-900">{maskEmail(email)}</span>
        </p>

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col items-center">
            <div className="flex justify-center gap-3 mb-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => { inputRefs.current[index] = el; }}
                   type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  className="w-16 h-16 text-center text-2xl font-semibold border-2 border-gray-300 rounded-lg focus:border-cyan-400 focus:outline-none transition-colors"
                />
              ))}
            </div>

            {error && (
              <p className="text-xs text-red-600 mt-2 text-center">
                {error}
              </p>
            )}
          </div>
          <div className="text-center mb-6 mt-4">
                {signupToken ? (
                  <>
                    <span className="text-sm text-gray-600">Didn't get code? </span>

                    {timer > 0 ? (
                      <span className="text-sm text-gray-400">Resend OTP ({timer}s)</span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleResend}
                        className="text-sm text-cyan-500 hover:text-cyan-600 font-medium"
                      >
                        Resend OTP
                      </button>
                    )}
                  </>
                ) : (
                  <span className="text-sm text-gray-400">({timer}s)</span>
                )}
              </div>
          <button
            type="submit"
            disabled={otp.join('').length !== 4}
            className="w-full bg-cyan-400 hover:bg-cyan-500 disabled:bg-cyan-300 disabled:cursor-not-allowed text-white font-medium py-3 rounded-lg transition-colors"
          >
            Verify
          </button>
        </form>
      </div>
    </div>
  );
};

export default OtpUI;
