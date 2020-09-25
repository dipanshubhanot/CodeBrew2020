import React from "react";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import QRCode from "qrcode.react";
import { useRouter } from "next/router";

export default function Index() {
  const router = useRouter();
  const { slug } = router.query;

  return (
    <Container maxWidth="sm">
      <Typography variant="h2" className="centerText">
        Scan QR Code
      </Typography>
      {slug && (
        <QRCode value={slug as string} size={256} className={"margin-auto"} />
      )}
      <style jsx global>{`
        .centerText {
          text-align: center;
        }
        .margin-auto {
          margin: 25px auto;
          display: block;
        }
      `}</style>
    </Container>
  );
}
