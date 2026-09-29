export default function EditorialSection() {
  return (
    <section className="grid min-h-screen grid-cols-[1.02fr_.98fr] items-center gap-[7vw] bg-flamora-ivory px-[5vw] py-[12vh] text-black max-md:grid-cols-1 max-md:px-6">
      <div className="h-[78vh] overflow-hidden max-md:h-[62vh]">
        <img src="/assets/editorial.png" alt="FLĀMORÁ editorial" className="h-full w-full object-cover transition duration-1000 hover:scale-[1.04]" />
      </div>
      <div>
        <small className="text-[9px] tracking-[0.28em] text-neutral-500">THE WOMAN, THE JEWEL</small>
        <h2 className="my-6 font-serif text-[clamp(54px,6vw,96px)] font-normal leading-[0.94] tracking-[-0.04em]">
          Quiet confidence.<br />Unmistakable presence.
        </h2>
        <p className="max-w-[470px] text-[13px] leading-[1.85] text-[#6f685f]">
          Jewellery comes alive when it moves with the wearer. Light changes. Proportion shifts. The final design is completed by the person who chooses it.
        </p>
      </div>
    </section>
  );
}
