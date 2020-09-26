import React from "react";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import QRCode from "qrcode.react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
const QrReader = dynamic(() => import("react-qr-reader"), {
  ssr: false,
});

export default function Index() {
  const router = useRouter();
  const { slug } = router.query;
  const [data, setData] = React.useState("asd");
  const [result, setResult] = React.useState({
    image: new Image(200, 200),
    value: true,
  });

  return (
    <Container maxWidth="sm">
      <Typography variant="h2" className="centerText">
        Scan QR Code
      </Typography>
      {!data && (
        <QrReader
          delay={300}
          facingMode="environment"
          onError={(err) => {
            console.log(err);
          }}
          onScan={(scan) => {
            if (scan) {
              setData(scan);
            }
            console.log(scan);
          }}
          style={{ width: "100%" }}
        />
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
