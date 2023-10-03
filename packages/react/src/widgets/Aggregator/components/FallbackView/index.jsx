const FallbackView = () => {
  return (
    <div
      style={{
        width: '100%',
        maxWidth: '1660px',
        margin: '0 auto',
        height: '630px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'transparent',
      }}
    >
      <svg viewBox="0 0 50 50" width="50" height="50">
        <circle cx="25" cy="25" r="20" stroke="#b1b5c3" strokeWidth="3" fill="none" />
        <circle cx="25" cy="25" r="10" stroke="#777e90" strokeWidth="3" fill="none">
          <animate attributeName="r" values="10;20;10" dur="1s" repeatCount="indefinite" />
          <animate attributeName="stroke-opacity" values="1;0;1" dur="1s" repeatCount="indefinite" />
        </circle>
      </svg>
    </div>
  )
}

export default FallbackView
