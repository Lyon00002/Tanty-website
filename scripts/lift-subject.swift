// Lift the foreground subject(s) out of a photo with Apple's Vision framework
// (the "lift subject" of Photos). usage: lift <in-image> <out.png>
import Foundation
import Vision
import CoreImage

let args = CommandLine.arguments
guard args.count == 3 else { fputs("usage: lift <in> <out.png>\n", stderr); exit(1) }
let handler = VNImageRequestHandler(url: URL(fileURLWithPath: args[1]))
let request = VNGenerateForegroundInstanceMaskRequest()
do {
    try handler.perform([request])
    guard let result = request.results?.first, !result.allInstances.isEmpty else { fputs("no subject\n", stderr); exit(2) }
    let buffer = try result.generateMaskedImage(ofInstances: result.allInstances, from: handler, croppedToInstancesExtent: false)
    let image = CIImage(cvPixelBuffer: buffer)
    try CIContext().writePNGRepresentation(of: image, to: URL(fileURLWithPath: args[2]), format: .RGBA8, colorSpace: CGColorSpace(name: CGColorSpace.sRGB)!)
    print("instances:", result.allInstances.count)
} catch {
    fputs("error: \(error)\n", stderr); exit(3)
}
