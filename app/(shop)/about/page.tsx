export default function AboutPage() {
  return (
    <div className="pt-32 pb-24 px-6 bg-ivory min-h-screen" data-testid="about-page">
      <div className="mx-auto max-w-3xl">
        <div className="text-center mb-14">
          <p className="eyebrow">◆ Depuis 1924</p>
          <h1 className="mt-6 font-display text-6xl text-emerald-vault">The <em className="gold-text not-italic">Maison</em></h1>
          <div className="hairline mt-6 mx-auto w-24" />
        </div>
        <div className="space-y-8 text-onyx/70 leading-relaxed font-light text-lg">
          <p>Founded in the discreet ateliers of Place Vendôme in 1924, FLAMORA has shaped gemstones for four generations of collectors, royalty, and the quietly extraordinary. Our founder, Émile Flamora, apprenticed under the great Cartier setters and left with a single conviction: <em>a jewel should be inherited, never announced.</em></p>
          <p>Today, our master jewellers still sign each piece by hand — inside the band, beneath the setting, where only the wearer sees. Every stone is chosen at the source: Colombian emeralds from Muzo, Ceylon sapphires from Ratnapura, Burmese rubies from the Mogok Valley. Diamonds are cut by candlelight — the only light that reveals a diamond's true fire.</p>
          <p>We do not chase trends. We do not photograph our clients. And we do not, under any circumstance, announce a new collection before it is placed on velvet. This is the maison's quiet way — and it has never changed.</p>
        </div>
      </div>
    </div>
  );
}
