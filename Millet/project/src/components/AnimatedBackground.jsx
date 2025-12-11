export default function AnimatedBackground() {
  return (
    <>
      <div className="sunburst"></div>

      <div className="wheat-background">
        {[...Array(10)].map((_, i) => (
          <div key={`wheat-${i}`} className="wheat-stalk"></div>
        ))}
      </div>

      <div className="grass-footer">
        <div className="grass">
          {[...Array(100)].map((_, i) => (
            <div
              key={`grass-${i}`}
              className="grass-blade"
              style={{
                left: `${i}%`,
                height: `${30 + Math.random() * 40}px`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            ></div>
          ))}
        </div>
      </div>
    </>
  )
}
