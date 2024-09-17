"use client";
import React, { useState } from 'react';
import { authenticator } from 'otplib';
import { useQRCode } from 'next-qrcode';
import { Button, Input, Card, CardHeader, CardBody, CardFooter, Typography } from 'shadcn/ui';

const TOTPPage = () => {
  const [qrCodeURL, setQrCodeURL] = useState<string>('');
  const [secret, setSecret] = useState<string>('');
  const [token, setToken] = useState<string>('');
  const [verificationResult, setVerificationResult] = useState<string>('');
  const { Image: ImageQR } = useQRCode();
  const [generatedToken, setGeneratedToken] = useState<string>('');

  const generateTOTP = () => {
    const secret = authenticator.generateSecret();
    setSecret(secret);
    const otpauth = authenticator.keyuri('user@example.com', 'YourAppName', secret);
    setQrCodeURL(otpauth);
  };

  const verifyTOTP = () => {
    const isValid = authenticator.check(token, secret);
    setVerificationResult(isValid ? 'Valid' : 'Invalid');
  };

  const generateCurrentToken = () => {
    const currentToken = authenticator.generate(secret);
    setGeneratedToken(currentToken);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <Typography variant="h4" className="text-center">TOTP Authentication</Typography>
        </CardHeader>
        <CardBody>
          <Button onClick={generateTOTP} className="w-full mb-4">Generate TOTP</Button>
          {qrCodeURL && (
            <div className="flex flex-col items-center">
              <ImageQR
                text={qrCodeURL}
                options={{
                  type: 'image/jpeg',
                  quality: 0.3,
                  errorCorrectionLevel: 'M',
                  margin: 3,
                  scale: 4,
                  width: 200,
                  color: {
                    dark: '#00000000',
                    light: '#FFFFFFFF',
                  },
                }}
              />
              <Typography variant="body1" className="mt-2">Secret: {secret}</Typography>
              <Button onClick={generateCurrentToken} className="w-full mt-4">Show Current TOTP Token</Button>
              {generatedToken && <Typography variant="body1" className="mt-2">Current TOTP Token: {generatedToken}</Typography>}
            </div>
          )}
          <div className="mt-4">
            <Input
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Enter TOTP token"
              className="w-full mb-2"
            />
            <Button onClick={verifyTOTP} className="w-full">Verify TOTP</Button>
            {verificationResult && <Typography variant="body1" className="mt-2 text-center">{verificationResult}</Typography>}
          </div>
        </CardBody>
        <CardFooter className="text-center">
          <Typography variant="body2">YourAppName</Typography>
        </CardFooter>
      </Card>
    </div>
  );
};

export default TOTPPage;