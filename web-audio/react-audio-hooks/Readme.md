# React Audio Hooks
- [choose input device and play it through the default output device](microphone.js)

  Caveats: You can't choose the output device (platform limitation). It always goes to the default output. You can change it in your operating system and it will update the UI.
    - on my Android Chrome I wasn't able to achieve my goal of being able to speak into the phone and have it come out of my bluetooth speaker.
    - on my Macbook Pro Chrome I was able to speak into the internal microphone and have it come out of whichever output device was the system default.
