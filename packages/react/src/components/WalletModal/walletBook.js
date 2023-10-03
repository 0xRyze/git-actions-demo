export const walletBook = {
  wallets: {
    metamask: {
      brand: {
        spriteId: 'metamask',
        alt: 'MetaMask Wallet',
        primaryColor: '#E8831D',
      },
      desktop: {
        chromeId: 'nkbihfbeogaeaoehlefnkodbefgpgknn',
        braveId: 'nkbihfbeogaeaoehlefnkodbefgpgknn',
        firefoxId: 'ether-metamask',
        edgeId: 'ejbalbakoplchlghecdalmeeeajnimhm',
      },
      mobile: {
        native: 'metamask://wc',
        universal: 'https://metamask.app.link/wc',
        iosId: 'id1438144202',
        androidId: 'io.metamask',
      },
      chains: ['EVM'],
      walletConnect: {
        sdks: ['sign_v1'],
      },
      name: 'MetaMask',
      shortName: 'MetaMask',
    },
    // brave: {
    //   brand: {
    //     imageId: '8cecad66-73e3-46ee-f45f-01503c032f00',
    //     alt: 'Brave Wallet',
    //     primaryColor: '#FF2000',
    //   },
    //   chains: [
    //     'eip155:1',
    //     'eip155:10',
    //     'eip155:1313161554',
    //     'eip155:137',
    //     'eip155:250',
    //     'eip155:4',
    //     'eip155:42220',
    //     'eip155:44787',
    //     'eip155:5',
    //     'eip155:56',
    //     'eip155:80001',
    //     'solana:4sGjMW1sUnHzSxGspuhpqLDx6wiyjNtZ',
    //     'solana:8E9rvCKLFQia2Y35HXjjpWzj8weVo44K',
    //   ],
    //   name: 'Brave Wallet',
    //   shortName: 'Brave',
    // },
    braveevm: {
      brand: {
        spriteId: 'brave',
        alt: 'Brave Browser',
        primaryColor: '#F39020',
      },
      mobile: {
        iosId: 'id1052879175',
        androidId: 'com.brave.browser',
      },
      chains: ['EVM'],
      name: 'Brave (EVM)',
    },
    // coinbase: {
    //   brand: {
    //     spriteId: 'coinbase',
    //     alt: 'Coinbase Wallet',
    //     primaryColor: '#1648F9',
    //   },
    //   desktop: {
    //     chromeId: 'hnfanknocfeofbddgcijnmhnfnkdnaad',
    //   },
    //   mobile: {
    //     iosId: 'id1278383455',
    //     androidId: 'org.toshi',
    //   },
    //   name: 'Coinbase Wallet',
    // },
    // coinbasesolana: {
    //   brand: {
    //     spriteId: 'coinbase',
    //     alt: 'Coinbase Wallet',
    //     primaryColor: '#1648F9',
    //   },
    //   desktop: {
    //     chromeId: 'hnfanknocfeofbddgcijnmhnfnkdnaad',
    //   },
    //   name: 'Coinbase Wallet (Solana)',
    // },
    walletconnect: {
      brand: {
        spriteId: 'walletconnect',
        alt: 'WalletConnect',
        primaryColor: '#3182CE',
      },
      mobile: {
        iosId: 'id1438144202',
        androidId: 'enable-android',
      },
      chains: ['EVM'],
      name: 'WalletConnect',
      isWalletConnect: true,
    },
    phantom: {
      brand: {
        spriteId: 'phantom',
        alt: 'Phantom Wallet',
        primaryColor: '#4B49C6',
      },
      desktop: {
        chromeId: 'bfnaelmomeimhlpmgjnjophhpkkoljpa',
        firefoxId: 'phantom-app',
      },
      mobile: {
        iosId: 'id1598432977',
        androidId: 'app.phantom',
      },
      chains: ['SOL'],
      name: 'Phantom',
    },
    bravesol: {
      brand: {
        spriteId: 'brave',
        alt: 'Brave Browser',
        primaryColor: '#4B49C6',
      },
      mobile: {
        iosId: 'id1052879175',
        androidId: 'com.brave.browser',
      },
      chains: ['SOL'],
      name: 'Brave (Solana)',
    },
    stacks: {
      brand: {
        spriteId: 'stacks',
        alt: 'Stacks Wallet',
        primaryColor: '#000000',
      },
      desktop: {},
      mobile: {},
      chains: ['STACKS'],
      name: 'Stacks',
    },
    haha: {
      brand: {
        spriteId: 'haha',
        alt: 'HaHa Wallet',
        imageId: '79285c9f-2630-451e-0680-c71b42fb7400',
        primaryColor: '#6B46D2',
      },
      chains: ['EVM'],
      mobile: {
        androidId: 'com.permutize.haha',
        iosId: 'id1591158244',
        native: 'haha://wc',
        universal: 'https://haha.me/wc',
        website: 'https://www.haha.me/',
      },
      name: 'HaHa',
      description: 'Get rewards on every transaction',
      walletConnect: {
        sdks: ['sign_v1', 'sign_v2', 'auth_v1'],
      },
      isWalletConnect: true,
    },
    // phantomevm: {
    //   brand: {
    //     spriteId: 'phantom',
    //     alt: 'Phantom Wallet',
    //     primaryColor: '#4B49C6',
    //   },
    //   desktop: {
    //     chromeId: 'bfnaelmomeimhlpmgjnjophhpkkoljpa',
    //     firefoxId: 'phantom-app',
    //   },
    //   mobile: {
    //     iosId: 'id1598432977',
    //     androidId: 'app.phantom',
    //   },
    //   name: 'Phantom (EVM)',
    // },
    // glow: {
    //   brand: {
    //     spriteId: 'glow',
    //     alt: 'Glow Wallet',
    //   },
    //   desktop: {
    //     chromeId: 'ojbcfhjmpigfobfclfflafhblgemeidi',
    //     firefoxId: 'glow-solana-wallet',
    //     edgeId: 'niihfokdlimbddhfmngnplgfcgpmlido',
    //   },
    //   name: 'Glow',
    // },
    // slope: {
    //   brand: {
    //     spriteId: 'slope',
    //     alt: 'Slope Wallet',
    //     primaryColor: '#6E66FA',
    //   },
    //   desktop: {
    //     chromeId: 'pocmplpaccanhmnllbbkpgfliimjljgo',
    //   },
    //   mobile: {
    //     iosId: 'id1574624530',
    //     androidId: 'com.wd.wallet',
    //   },
    //   name: 'Slope',
    // },
    // solflare: {
    //   brand: {
    //     spriteId: 'solflare',
    //     alt: 'Solflare Wallet',
    //     primaryColor: '#FC7227',
    //   },
    //   desktop: {
    //     chromeId: 'bhhhlbepdkbapadjdnnojkbgioiodbic',
    //   },
    //   name: 'Solflare',
    // },
  },
}
