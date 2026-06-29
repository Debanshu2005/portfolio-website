export type GalleryPhoto = {
  title: string;
  src: string;
  alt?: string;
  caption?: string;
  orientation?: "wide" | "tall" | "square";
};

export const galleryPhotos: GalleryPhoto[] = [
  // Add photos to public/gallery, then add entries like this:
  // {
  //   title: "Drone test bench",
  //   src: "/gallery/drone-test-bench.jpg",
  //   alt: "Drone electronics arranged on a workbench",
  //   caption: "Flight controller wiring before field testing.",
  //   orientation: "wide",
  // },
  {
    title: "Autonomous Quadcopter",
    src: "/gallery/Drone.jpeg",
    alt: "Drone electronics arranged on a workbench",
    caption: "Autonomous Drone based on Raspberry Pi and APM2.8",
    orientation: "wide",
  },
  {
    title: "AI assistant Buddy",
    src: "/gallery/Buddy.jpeg",
    alt: "AI assistance named Buddy",
    caption: "An AI assistance named Buddy based on Raspberry Pi and Arduino UNO",
    orientation: "wide",
  },
  {
    title: "Bluetooth Car",
    src: "/gallery/IIEST.jpeg",
    alt: "Bluettoth control robot",
    caption: "Me with my team at IIEST Shibpur during Techfest 2026",
    orientation: "wide",
  },
  {
    title: "Me receiving 3rd postition medal",
    src: "/gallery/Prize.jpeg",
    alt: "At Freshers 2026",
    caption: "Receiving 3rd position medal from our head of department",
    orientation: "wide",
  },
  {
    title: "Me and my team at New Delhi to attend Brainwave 2.0",
    src: "/gallery/At_DTU2.jpeg",
    alt: "At the DTU campus",
    caption: "Team Tech Savy at DTU to attend Brainwave 2.0",
    orientation: "wide",
  },
  {
    title: "Me and my team in FIEM to attend Hacktonix",
    src: "/gallery/Hacktonix.jpeg",
    alt: "At FIEM for Hacktonix",
    caption: "Team Tech Savy at FIEM to attend Hacktonix",
    orientation: "wide",
  },
];
