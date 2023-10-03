import { SupportedChainId } from '../../constants/chains'
import React from 'react'

const TokenIcon = (propss) => {
  const { chainId, ...props } = propss
  if ([SupportedChainId.BINANCE, SupportedChainId.BINANCE_TESTNET].includes(chainId)) {
    return (
      <svg width="100" height="100" viewBox="0 0 100 100" fill="none" {...props}>
        <g clipPath="url(#clip0_217_1165)">
          <path
            d="M30.5799 42.022L50.0029 22.6009L69.4318 42.0298L80.7332 30.7303L50.0029 0L19.2804 30.7205L30.5799 42.02V42.022ZM0 50.0029L11.3014 38.6995L22.6009 50.0029L11.2995 61.2985L0 50.0029ZM30.5799 57.9819L50.0029 77.401L69.4318 57.9721L80.7391 69.2658L50.0029 100.006L19.2804 69.2814L19.2648 69.2638L30.5799 57.98V57.9819ZM77.401 50.0029L88.7005 38.7034L100.006 50.0029L88.7064 61.3024L77.401 50.0029Z"
            fill={props.grey ? props.grey : '#F3BA2F'}
          />
          <path
            d="M61.4608 50.0031L50.0031 38.5278L41.5261 47.001L40.5494 47.9776L38.5435 49.9836L38.5278 49.9992L38.5435 50.0148L50.0031 61.4725L61.4686 50.007H61.4589"
            fill={props.grey ? props.grey : '#F3BA2F'}
          />
        </g>
        <defs>
          <clipPath id="clip0_217_1165">
            <rect width="100" height="100" fill="white" />
          </clipPath>
        </defs>
      </svg>
    )
  }

  if ([SupportedChainId.POLYGON_MUMBAI, SupportedChainId.POLYGON_MAINNET].includes(chainId)) {
    return (
      <svg width="200" height="200" viewBox="0 0 38.4 33.5" xmlns="http://www.w3.org/2000/svg" {...props}>
        <g>
          <path
            fill={props.grey ? props.grey : '#8247E5'}
            d="M29,10.2c-0.7-0.4-1.6-0.4-2.4,0L21,13.5l-3.8,2.1l-5.5,3.3c-0.7,0.4-1.6,0.4-2.4,0L5,16.3
        c-0.7-0.4-1.2-1.2-1.2-2.1v-5c0-0.8,0.4-1.6,1.2-2.1l4.3-2.5c0.7-0.4,1.6-0.4,2.4,0L16,7.2c0.7,0.4,1.2,1.2,1.2,2.1v3.3l3.8-2.2V7
        c0-0.8-0.4-1.6-1.2-2.1l-8-4.7c-0.7-0.4-1.6-0.4-2.4,0L1.2,5C0.4,5.4,0,6.2,0,7v9.4c0,0.8,0.4,1.6,1.2,2.1l8.1,4.7
        c0.7,0.4,1.6,0.4,2.4,0l5.5-3.2l3.8-2.2l5.5-3.2c0.7-0.4,1.6-0.4,2.4,0l4.3,2.5c0.7,0.4,1.2,1.2,1.2,2.1v5c0,0.8-0.4,1.6-1.2,2.1
        L29,28.8c-0.7,0.4-1.6,0.4-2.4,0l-4.3-2.5c-0.7-0.4-1.2-1.2-1.2-2.1V21l-3.8,2.2v3.3c0,0.8,0.4,1.6,1.2,2.1l8.1,4.7
        c0.7,0.4,1.6,0.4,2.4,0l8.1-4.7c0.7-0.4,1.2-1.2,1.2-2.1V17c0-0.8-0.4-1.6-1.2-2.1L29,10.2z"
          />
        </g>
      </svg>
    )
  }

  if ([SupportedChainId.STACKS_MAINNET, SupportedChainId.STACKS_TESTNET].includes(chainId)) {
    return (
      <svg width="200" height="200" viewBox="0 0 159.8 159.8" xmlns="http://www.w3.org/2000/svg" {...props}>
        <circle fill={props.grey ? props.grey : '#5546FF'} cx="79.9" cy="79.9" r="79.9" />
        <path
          fill="#FFFFFF"
          className="st1"
          d="M112.5,122L95.3,95H120V84.8H39v10.2h24.7L46.5,122h12.8l20.2-31.7L99.7,122H112.5z M120,74.9V64.7H95.8
	l17-26.7H99.9L79.5,70.2L59.1,38H46.2l17,26.7H39V75L120,74.9L120,74.9z"
        />
      </svg>
    )
  }

  if ([SupportedChainId.SOLANA, SupportedChainId.SOLANA_DEVNET].includes(chainId)) {
    return (
      <svg fill="none" viewBox="0 0 28 25" id="solana" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path
          d="m27.856 19.235-4.622 4.829a1.075 1.075 0 0 1-.786.332H.537a.547.547 0 0 1-.295-.086.51.51 0 0 1-.098-.794l4.626-4.829a1.073 1.073 0 0 1 .783-.332h21.91c.105 0 .207.03.295.086a.51.51 0 0 1 .098.794ZM23.234 9.51a1.074 1.074 0 0 0-.786-.332H.537a.547.547 0 0 0-.295.085.51.51 0 0 0-.098.794l4.626 4.83a1.073 1.073 0 0 0 .783.332h21.91c.105 0 .207-.03.295-.086a.51.51 0 0 0 .098-.794l-4.622-4.83ZM.537 6.04h21.911a1.098 1.098 0 0 0 .786-.331l4.622-4.83a.518.518 0 0 0 .1-.565.528.528 0 0 0-.198-.228.547.547 0 0 0-.295-.086H5.553a1.098 1.098 0 0 0-.783.332L.145 5.162a.518.518 0 0 0-.1.564.545.545 0 0 0 .492.315Z"
          fill="url(#ata)"
        />
        <defs>
          <linearGradient id="ata" x1="2.364" y1="24.977" x2="24.671" y2="-.836" gradientUnits="userSpaceOnUse">
            <stop offset=".08" stopColor="#9945FF" />
            <stop offset=".3" stopColor="#8752F3" />
            <stop offset=".5" stopColor="#5497D5" />
            <stop offset=".6" stopColor="#43B4CA" />
            <stop offset=".72" stopColor="#28E0B9" />
            <stop offset=".97" stopColor="#19FB9B" />
          </linearGradient>
        </defs>
      </svg>
    )
  }

  if ([SupportedChainId.BASE_MAINNET, SupportedChainId.BASE_TESTNET].includes(chainId)) {
    return (
      <svg width="16" height="16" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clip-path="url(#clip0_211_2)">
          <path
            d="M8.90611 17.8434C13.842 17.8434 17.8434 13.849 17.8434 8.92168C17.8434 3.99436 13.842 0 8.90611 0C4.22322 0 0.381537 3.59536 0 8.17172H11.813V9.67161H6.41595e-08C0.381537 14.248 4.22322 17.8434 8.90611 17.8434Z"
            fill="#0052FF"
          />
        </g>
        <defs>
          <clipPath id="clip0_211_2">
            <rect width="18" height="18" fill="white" />
          </clipPath>
        </defs>
      </svg>
    )
  }

  if ([SupportedChainId.CORE_MAINNET, SupportedChainId.CORE_TESTNET].includes(chainId)) {
    return (
      <svg width="16" height="16" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#clip0_215_29)">
          <path
            d="M9.04502 1.635C9.22502 1.635 9.40502 1.68 9.57002 1.77L15.045 4.935C15.36 5.115 15.57 5.46 15.57 5.835V12.165C15.57 12.54 15.375 12.885 15.045 13.065L9.55502 16.23C9.40502 16.32 9.22502 16.365 9.03002 16.365C8.85002 16.365 8.67002 16.32 8.50502 16.23L3.04502 13.065C2.73002 12.885 2.52002 12.54 2.52002 12.165V5.835C2.52002 5.46 2.71502 5.115 3.04502 4.935L8.53502 1.77C8.68502 1.68 8.86502 1.635 9.04502 1.635ZM9.04502 0C8.58002 0 8.13002 0.12 7.71002 0.36L2.23502 3.525C1.41002 4.005 0.900024 4.875 0.900024 5.835V12.165C0.900024 13.125 1.41002 13.995 2.23502 14.475L7.72502 17.64C8.14502 17.88 8.59502 18 9.06002 18C9.52502 18 9.97502 17.88 10.395 17.64L15.885 14.475C16.71 13.995 17.22 13.125 17.22 12.165V5.835C17.22 4.875 16.71 4.005 15.885 3.525L10.38 0.36C9.97502 0.12 9.51002 0 9.04502 0Z"
            fill="#FD9500"
          />
        </g>
        <defs>
          <clipPath id="clip0_215_29">
            <rect width="18" height="18" fill="white" />
          </clipPath>
        </defs>
      </svg>
    )
  }
  if ([SupportedChainId.TELOS_MAINNET, SupportedChainId.TELOS_TESTNET].includes(chainId)) {
    return (
      <svg version="1.0" width="16" height="16" viewBox="0 0 128.000000 128.000000" preserveAspectRatio="xMidYMid meet">
        <g transform="translate(0.000000,128.000000) scale(0.100000,-0.100000)" fill="#571AFF" stroke="none">
          <path
            d="M472 1260 c-115 -31 -187 -74 -282 -170 -97 -96 -138 -164 -170 -284
-28 -102 -24 -266 8 -366 61 -186 206 -334 400 -408 60 -23 82 -26 202 -26
113 -1 147 3 205 21 190 60 339 205 413 401 23 60 26 82 26 202 1 113 -3 147
-21 205 -60 190 -206 340 -401 413 -94 35 -274 41 -380 12z m517 -159 c11 -7
5 -25 -28 -88 -22 -43 -41 -82 -41 -87 0 -4 43 -71 96 -148 l96 -140 -19 -106
-18 -107 -50 -7 c-113 -18 -114 -18 -117 -40 -2 -15 -35 -45 -100 -90 l-97
-68 -157 -35 c-86 -20 -166 -35 -177 -33 -15 2 -30 34 -73 153 l-54 150 0 126
c0 111 2 128 19 143 19 17 19 19 -10 79 -16 34 -29 71 -29 82 0 13 28 43 76
83 l75 62 169 0 170 0 17 28 c9 15 23 33 32 40 17 14 198 17 220 3z"
          />
          <path
            d="M770 1025 l-22 -35 -175 0 -176 0 -63 -56 -64 -55 30 -59 c35 -70 37
-91 10 -115 -18 -16 -20 -31 -20 -124 0 -103 1 -111 51 -248 30 -84 56 -140
63 -138 6 2 73 18 150 35 134 30 142 33 227 93 75 51 89 65 89 88 0 30 6 33
111 45 l56 6 12 68 c6 38 11 77 11 87 0 11 -43 81 -95 157 -52 75 -95 143 -95
150 0 7 13 37 30 67 16 30 30 57 30 62 0 4 -31 7 -69 7 -68 0 -70 0 -91 -35z"
          />
        </g>
      </svg>
    )
  }

  if ([SupportedChainId.OPTIMISM_GOERLI, SupportedChainId.OPTIMISM_MAINNET].includes(chainId)) {
    return (
      <svg width="16" height="16" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="250" cy="250" r="250" fill="#FF0420" />
        <path
          d="M177.133 316.446C162.247 316.446 150.051 312.943 140.544 305.938C131.162 298.808 126.471 288.676 126.471 275.541C126.471 272.789 126.784 269.411 127.409 265.408C129.036 256.402 131.35 245.581 134.352 232.947C142.858 198.547 164.812 181.347 200.213 181.347C209.845 181.347 218.476 182.973 226.107 186.225C233.738 189.352 239.742 194.106 244.12 200.486C248.498 206.74 250.688 214.246 250.688 223.002C250.688 225.629 250.375 228.944 249.749 232.947C247.873 244.08 245.621 254.901 242.994 265.408C238.616 282.546 231.048 295.368 220.29 303.874C209.532 312.255 195.147 316.446 177.133 316.446ZM179.76 289.426C186.766 289.426 192.707 287.362 197.586 283.234C202.59 279.106 206.155 272.789 208.281 264.283C211.158 252.524 213.348 242.266 214.849 233.51C215.349 230.883 215.599 228.194 215.599 225.441C215.599 214.058 209.657 208.366 197.774 208.366C190.768 208.366 184.764 210.43 179.76 214.558C174.882 218.687 171.379 225.004 169.253 233.51C167.001 241.891 164.749 252.149 162.498 264.283C161.997 266.784 161.747 269.411 161.747 272.163C161.747 283.672 167.752 289.426 179.76 289.426Z"
          fill="white"
        />
        <path
          d="M259.303 314.57C257.927 314.57 256.863 314.132 256.113 313.256C255.487 312.255 255.3 311.13 255.55 309.879L281.444 187.914C281.694 186.538 282.382 185.412 283.508 184.536C284.634 183.661 285.822 183.223 287.073 183.223H336.985C350.87 183.223 362.003 186.1 370.384 191.854C378.891 197.609 383.144 205.927 383.144 216.81C383.144 219.937 382.769 223.19 382.018 226.567C378.891 240.953 372.574 251.586 363.067 258.466C353.685 265.346 340.8 268.786 324.413 268.786H299.082L290.451 309.879C290.2 311.255 289.512 312.38 288.387 313.256C287.261 314.132 286.072 314.57 284.822 314.57H259.303ZM325.727 242.892C330.98 242.892 335.546 241.453 339.424 238.576C343.427 235.699 346.054 231.571 347.305 226.192C347.68 224.065 347.868 222.189 347.868 220.563C347.868 216.935 346.805 214.183 344.678 212.307C342.551 210.305 338.924 209.305 333.795 209.305H311.278L304.148 242.892H325.727Z"
          fill="white"
        />
      </svg>
    )
  }

  if ([SupportedChainId.ARBITRUM, SupportedChainId.ARBITRUM_GOERLI].includes(chainId)) {
    return (
      <svg width="16" height="16" viewBox="0 0 265 297" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M166.068 136.099L187.862 99.119L246.605 190.613L246.633 208.171L246.441 87.345C246.302 84.392 244.734 81.689 242.231 80.096L136.472 19.263C133.998 18.047 130.861 18.06 128.392 19.301C128.059 19.469 127.745 19.65 127.445 19.848L127.077 20.08L24.421 79.569L24.022 79.749C23.51 79.985 22.992 80.284 22.506 80.632C20.56 82.028 19.267 84.092 18.849 86.407C18.786 86.758 18.74 87.115 18.718 87.475L18.879 185.936L73.595 101.129C80.484 89.883 95.493 86.261 109.426 86.458L125.779 86.89L29.426 241.413L40.784 247.953L138.292 87.047L181.391 86.89L84.134 251.857L124.663 275.168L129.505 277.953C131.553 278.786 133.968 278.827 136.034 278.082L243.279 215.932L222.775 227.813L166.068 136.099ZM174.383 255.858L133.448 191.611L158.436 149.209L212.196 233.944L174.383 255.858Z"
          fill="#2D374B"
        />
        <path d="M133.448 191.611L174.383 255.858L212.197 233.945L158.437 149.209L133.448 191.611Z" fill="#28A0F0" />
        <path
          d="M246.632 208.172L246.604 190.614L187.861 99.12L166.067 136.1L222.775 227.814L243.279 215.933C245.29 214.3 246.507 211.903 246.635 209.316L246.632 208.172Z"
          fill="#28A0F0"
        />
        <path
          d="M0.470978 224.73L29.426 241.414L125.779 86.891L109.426 86.459C95.493 86.262 80.484 89.884 73.595 101.13L18.879 185.937L0.470978 214.22V224.73Z"
          fill="white"
        />
        <path
          d="M181.391 86.891L138.293 87.048L40.785 247.954L74.866 267.578L84.135 251.858L181.391 86.891Z"
          fill="white"
        />
        <path
          d="M264.794 86.669C264.434 77.656 259.554 69.404 251.909 64.6L144.764 2.98499C137.202 -0.823009 127.755 -0.828011 120.181 2.98199C119.286 3.43299 15.984 63.345 15.984 63.345C14.555 64.03 13.178 64.847 11.882 65.774C5.05799 70.665 0.897978 78.265 0.470978 86.615V214.222L18.879 185.939L18.718 87.478C18.74 87.118 18.785 86.764 18.849 86.414C19.264 84.097 20.558 82.03 22.506 80.634C22.992 80.286 128.058 19.47 128.392 19.303C130.862 18.062 134 18.05 136.472 19.265L242.231 80.099C244.733 81.692 246.302 84.394 246.441 87.348V209.317C246.313 211.904 245.291 214.3 243.279 215.934L222.775 227.815L212.196 233.946L174.382 255.86L136.034 278.084C133.968 278.83 131.554 278.789 129.505 277.955L84.134 251.859L74.866 267.578L115.64 291.054C116.988 291.82 118.19 292.5 119.176 293.054C120.703 293.91 121.743 294.482 122.11 294.66C125.008 296.067 129.177 296.887 132.935 296.887C136.38 296.887 139.739 296.254 142.918 295.009L254.302 230.503C260.695 225.55 264.456 218.08 264.795 209.988V86.669H264.794Z"
          fill="#96BEDC"
        />
      </svg>
    )
  }

  if ([SupportedChainId.AVALANCHE, SupportedChainId.AVALANCHE_TESTNET].includes(chainId)) {
    return (
      <svg width="16" height="16" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M250 500C388.071 500 500 388.071 500 250C500 111.929 388.071 0 250 0C111.929 0 0 111.929 0 250C0 388.071 111.929 500 250 500Z"
          fill="#E84142"
        />
        <path
          d="M338.189 256.496C346.85 241.535 360.827 241.535 369.488 256.496L423.425 351.181C432.086 366.142 425 378.346 407.677 378.346H299.016C281.89 378.346 274.803 366.141 283.268 351.181L338.189 256.496ZM233.858 74.213C242.519 59.252 256.299 59.252 264.96 74.213L276.968 95.867L305.314 145.67C312.204 159.843 312.204 176.576 305.314 190.749L210.235 355.513C201.574 368.899 187.204 377.363 171.259 378.348H92.322C74.999 378.348 67.913 366.34 76.574 351.183L233.858 74.213Z"
          fill="white"
        />
      </svg>
    )
  }

  if ([SupportedChainId.SHARDEUM20, SupportedChainId.SHARDEUM_SPHINX].includes(chainId)) {
    return (
      <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path
          d="M43.59 82.5344L7.97437 144.211L28.8329 144.282C47.4921 144.33 49.7151 144.306 49.9516 143.975C50.1171 143.762 61.445 124.18 75.1379 100.46C88.8307 76.7167 100.111 57.3008 100.182 57.3008C100.253 57.3008 111.51 76.7167 125.203 100.437C138.896 124.157 150.224 143.738 150.389 143.951C150.65 144.306 152.4 144.33 171.532 144.282L192.367 144.211L156.846 82.6526C137.288 48.8107 121.254 21.0467 121.183 20.9994C121.135 20.9521 116.406 28.9691 110.706 38.8545C104.983 48.7398 100.253 56.8278 100.182 56.8278C100.111 56.8278 95.4525 48.8817 89.824 39.1383C84.1955 29.4185 79.513 21.3305 79.3947 21.1649C79.2765 20.9521 67.2627 41.5268 43.59 82.5344Z"
          fill={props.dark ? 'white' : 'black'}
        />
        <path
          d="M95.453 93.2239C84.598 95.5179 76.7938 105.805 77.5742 116.802C77.929 121.768 79.7736 126.262 83.1318 130.329C85.4258 133.096 90.2738 136.1 94.3888 137.282C96.0206 137.755 96.8246 137.826 100.183 137.826C104.771 137.826 106.379 137.471 110.234 135.58C122.035 129.833 126.386 115.17 119.67 103.819C118.085 101.17 114.443 97.4808 111.889 95.9909C106.852 93.0584 100.987 92.0651 95.453 93.2239Z"
          fill={props.dark ? 'white' : 'black'}
        />
        <path
          d="M49.6686 144.614C49.5504 144.779 44.8678 152.891 39.2393 162.658L28.9993 180.395L64.5912 180.466C84.1727 180.489 116.194 180.489 135.775 180.466L171.367 180.395L160.985 162.421L150.627 144.448L100.23 144.377C60.429 144.33 49.8105 144.401 49.6686 144.614Z"
          fill={props.dark ? 'white' : 'black'}
        />
      </svg>
    )
  }

  if ([SupportedChainId.ZORA_MAINNET, SupportedChainId.ZORA_GOERLI].includes(chainId)) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="3234" height="3234" viewBox="0 0 3234 3234" fill="none" {...props}>
        <mask
          id="mask0_501_204"
          // style="mask-type:alpha"
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="3234"
          height="3234"
        >
          <circle cx="1617" cy="1617" r="1617" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_501_204)">
          <rect x="-499" y="-703" width="4281" height="4281" fill="#A1723A" />
          <g filter="url(#filter0_f_501_204)">
            <ellipse cx="1740.5" cy="1441" rx="1725.5" ry="1725" fill="#531002" />
          </g>
          <g filter="url(#filter1_f_501_204)">
            <ellipse cx="1926.5" cy="1220" rx="1399.5" ry="1400" fill="#2B5DF0" />
          </g>
          <g filter="url(#filter2_f_501_204)">
            <ellipse cx="1901" cy="1240.5" rx="1459" ry="1459.5" fill="url(#paint0_radial_501_204)" />
          </g>
          <g filter="url(#filter3_f_501_204)">
            <circle cx="2143" cy="873" r="735" fill="#FCB8D4" />
          </g>
          <g filter="url(#filter4_f_501_204)">
            <circle cx="2142.5" cy="872.5" r="293.5" fill="white" />
          </g>
          <g filter="url(#filter5_f_501_204)">
            <circle cx="1947.5" cy="1165.5" r="2637.5" fill="url(#paint1_radial_501_204)" fillOpacity="0.9" />
          </g>
        </g>
        <defs>
          <filter
            id="filter0_f_501_204"
            x="-385"
            y="-684"
            width="4251"
            height="4250"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
            <feGaussianBlur stdDeviation="200" result="effect1_foregroundBlur_501_204" />
          </filter>
          <filter
            id="filter1_f_501_204"
            x="-273"
            y="-980"
            width="4399"
            height="4400"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
            <feGaussianBlur stdDeviation="400" result="effect1_foregroundBlur_501_204" />
          </filter>
          <filter
            id="filter2_f_501_204"
            x="142"
            y="-519"
            width="3518"
            height="3519"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
            <feGaussianBlur stdDeviation="150" result="effect1_foregroundBlur_501_204" />
          </filter>
          <filter
            id="filter3_f_501_204"
            x="808"
            y="-462"
            width="2670"
            height="2670"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
            <feGaussianBlur stdDeviation="300" result="effect1_foregroundBlur_501_204" />
          </filter>
          <filter
            id="filter4_f_501_204"
            x="1449"
            y="179"
            width="1387"
            height="1387"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
            <feGaussianBlur stdDeviation="200" result="effect1_foregroundBlur_501_204" />
          </filter>
          <filter
            id="filter5_f_501_204"
            x="-990"
            y="-1772"
            width="5875"
            height="5875"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
            <feGaussianBlur stdDeviation="150" result="effect1_foregroundBlur_501_204" />
          </filter>
          <radialGradient
            id="paint0_radial_501_204"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(2147.09 828.748) rotate(128.228) scale(2755.49 2755.27)"
          >
            <stop offset="0.286458" stopColor="#387AFA" />
            <stop offset="0.647782" stopColor="#387AFA" stopOpacity="0" />
          </radialGradient>
          <radialGradient
            id="paint1_radial_501_204"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(1947.5 1165.5) rotate(90) scale(2637.5)"
          >
            <stop offset="0.598958" stopOpacity="0" />
            <stop offset="0.671875" />
            <stop offset="0.734375" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>
    )
  }

  return (
    <svg width="100" height="100" viewBox="0 0 100 100" fill="none" {...props}>
      <g clipPath="url(#clip0_226_1177)">
        <path
          d="M49.6859 0L49.0156 2.27815V68.3847L49.6859 69.0537L80.3718 50.9154L49.6859 0Z"
          fill={props.grey ? props.grey : '#343434'}
        />
        <path d="M49.6859 0L19 50.9154L49.6859 69.054V36.9679V0Z" fill={props.grey ? props.grey : '#8C8C8C'} />
        <path
          d="M49.6853 74.8636L49.3076 75.3241V98.8727L49.6853 99.9758L80.3897 56.7344L49.6853 74.8636Z"
          fill={props.grey ? props.grey : '#3C3C3B'}
        />
        <path d="M49.6859 99.976V74.8636L19 56.7344L49.6859 99.976Z" fill={props.grey ? props.grey : '#8C8C8C'} />
        <path d="M49.6855 69.0539L80.371 50.9158L49.6855 36.9683V69.0539Z" fill={props.grey ? props.grey : '#141414'} />
        <path d="M19 50.9158L49.6854 69.0542V36.9683L19 50.9158Z" fill={props.grey ? props.grey : '#393939'} />
      </g>
      <defs>
        <clipPath id="clip0_226_1177">
          <rect width="100" height="100" fill="white" />
        </clipPath>
      </defs>
    </svg>
  )
}

export default TokenIcon
