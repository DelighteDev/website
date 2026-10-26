import WavyHeading from "../components/WavyHeading";

export default function TrainingDataPage() {
  return (
    <div className="training-page page-section">
      <div className="training-illustration" aria-hidden="true">
        <svg viewBox="0 0 300 110">
          <path d="M4 82c30-34 56-30 81 0s54 31 82-2 62-40 93-4 30 18 36 17" />
          <path d="M22 97c35-20 54-16 80 0s57 12 83-5 62-16 91 2" />
          <path d="M75 26v15M148 12v20M224 28v14" />
        </svg>
      </div>
      <WavyHeading as="h1" className="page-heading">
        Coming soon
      </WavyHeading>
    </div>
  );
}
