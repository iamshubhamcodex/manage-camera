import SvgWrapper from "../components/common/SvgWrapper";

export default function StatusIcon() {
  return (
    <SvgWrapper width={16} height={16} view={16} fill="none">
      <g clipPath="url(#clip0_1_1717)">
        <path
          d="M4.12008 13.3333C4.92274 13.3333 5.57341 12.6827 5.57341 11.88C5.57341 11.0773 4.92274 10.4267 4.12008 10.4267C3.31743 10.4267 2.66675 11.0773 2.66675 11.88C2.66675 12.6827 3.31743 13.3333 4.12008 13.3333Z"
          fill="#7E7E7E"
        />
        <path
          d="M2.66675 2.95999V4.84666C7.35342 4.84666 11.1534 8.64666 11.1534 13.3333H13.0401C13.0401 7.60666 8.39341 2.95999 2.66675 2.95999ZM2.66675 6.73333V8.61999C5.26675 8.61999 7.38008 10.7333 7.38008 13.3333H9.26675C9.26675 9.68666 6.31341 6.73333 2.66675 6.73333Z"
          fill="#7E7E7E"
        />
      </g>
      <defs>
        <clipPath id="clip0_1_1717">
          <rect width={16} height={16} fill="white" />
        </clipPath>
      </defs>
    </SvgWrapper>
  );
}
