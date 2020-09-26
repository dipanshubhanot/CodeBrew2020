import React from "react";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import QRCode from "qrcode.react";
import { useRouter } from "next/router";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import dynamic from "next/dynamic";
import CovidPassportService from "../../services/CovidPassportService";
const QrReader = dynamic(() => import("react-qr-reader"), {
  ssr: false,
});

export default function Index() {
  const router = useRouter();
  const { slug } = router.query;
  const [data, setData] = React.useState();
  const [result, setResult] = React.useState();

  return (
    <Container maxWidth="sm">
      <Typography variant="h3" className="centerText">
        Scan QR Code
      </Typography>
      {!data && (
        <QrReader
          delay={300}
          facingMode="environment"
          onError={(err) => {
            console.log(err);
          }}
          onScan={async (scan: any) => {
            if (scan) {
              setData(scan as any);
              const response = await CovidPassportService.verifyScan(scan);
              setResult(response as any);
            }
            console.log(scan);
          }}
          style={{ width: "100%" }}
        />
      )}
      {result && (
        <React.Fragment>
          <img className="img" src={result.image} />{" "}
          {result.value ? (
            <CheckCircleIcon
              style={{ fontSize: "8em" }}
              fontSize="large"
              className={"check"}
            />
          ) : null}
        </React.Fragment>
      )}
      <style jsx global>{`
        .centerText {
          text-align: center;
        }
        .margin-auto {
          margin: 25px auto;
          display: block;
        }
        .img {
          width: 70%;
          margin: 20px auto;
          display: block;
        }
        svg.check {
          display: block;
          color: #4caf50;
          fontsize: 8em;
          margin: auto;
        }
      `}</style>
    </Container>
  );
}
