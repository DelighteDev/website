import { hiddenTrainingCipher } from "../data/training";

export default function HorrorTrainingDataPage() {
  return (
    <div className="training-page page-section horror-training">
      <h1 className="visually-hidden">Training Data</h1>
      <div className="horror-training-message" aria-hidden="true">
        <svg viewBox="0 0 700 28" preserveAspectRatio="none">
          <path d="M3 15l31-8 21 14 37-17 26 13 18-9 42 15 33-19 29 15 46-10 22 13 31-17 34 15 26-8 39 14 37-18 28 16 36-11 30 12 45-17 33 14 26-8 34 11" />
          <path d="M62 24l27-7 44 8 39-6 31 7 52-9 37 8 46-6 28 7 49-9 36 8 43-6 39 5 47-7 39 6" />
        </svg>
        <div
          className="horror-training-source"
          dangerouslySetInnerHTML={{ __html: `<!-- ${hiddenTrainingCipher} -->` }}
        />
      </div>
    </div>
  );
}
