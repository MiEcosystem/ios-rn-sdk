#import "GPHParticleCellManager.h"
#import "RCTConvert.h"

#import "GPHParticleCell.h"

@implementation GPHParticleCellManager

RCT_EXPORT_MODULE();

- (UIView*)view
{
  return [[GPHParticleCell alloc] initWithFrame:CGRectZero];
}

RCT_EXPORT_VIEW_PROPERTY(name, NSString*);

RCT_EXPORT_VIEW_PROPERTY(enabled, BOOL);

RCT_EXPORT_VIEW_PROPERTY(color, CGColor);

RCT_EXPORT_VIEW_PROPERTY(lifetime, float);
RCT_EXPORT_VIEW_PROPERTY(lifetimeRange, float);
RCT_EXPORT_VIEW_PROPERTY(birthRate, float);

RCT_EXPORT_VIEW_PROPERTY(emissionLatitude, CGFloat);
RCT_EXPORT_VIEW_PROPERTY(emissionLongitude, CGFloat);
RCT_EXPORT_VIEW_PROPERTY(emissionRange, CGFloat);

RCT_EXPORT_VIEW_PROPERTY(velocity, CGFloat);
RCT_EXPORT_VIEW_PROPERTY(velocityRange, CGFloat);

RCT_EXPORT_VIEW_PROPERTY(xAcceleration, CGFloat);
RCT_EXPORT_VIEW_PROPERTY(yAcceleration, CGFloat);
RCT_EXPORT_VIEW_PROPERTY(zAcceleration, CGFloat);

RCT_EXPORT_VIEW_PROPERTY(scale, CGFloat);
RCT_EXPORT_VIEW_PROPERTY(scaleRange, CGFloat);
RCT_EXPORT_VIEW_PROPERTY(scaleSpeed, CGFloat);

RCT_EXPORT_VIEW_PROPERTY(spin, CGFloat);
RCT_EXPORT_VIEW_PROPERTY(spinRange, CGFloat);

RCT_EXPORT_VIEW_PROPERTY(redRange, float);
RCT_EXPORT_VIEW_PROPERTY(greenRange, float);
RCT_EXPORT_VIEW_PROPERTY(blueRange, float);
RCT_EXPORT_VIEW_PROPERTY(alphaRange, float);

RCT_EXPORT_VIEW_PROPERTY(redSpeed, float);
RCT_EXPORT_VIEW_PROPERTY(greenSpeed, float);
RCT_EXPORT_VIEW_PROPERTY(blueSpeed, float);
RCT_EXPORT_VIEW_PROPERTY(alphaSpeed, float);

RCT_EXPORT_VIEW_PROPERTY(contentsRect, CGRect);
RCT_EXPORT_VIEW_PROPERTY(contentsScale, CGFloat);

RCT_EXPORT_VIEW_PROPERTY(magnificationFilter, NSString*);
RCT_EXPORT_VIEW_PROPERTY(minificationFilter, NSString*);
RCT_EXPORT_VIEW_PROPERTY(minificationFilterBias, float);

// from CAMediaTiming
RCT_EXPORT_VIEW_PROPERTY(beginTime, double);
RCT_EXPORT_VIEW_PROPERTY(duration, double);
RCT_EXPORT_VIEW_PROPERTY(speed, float);
RCT_EXPORT_VIEW_PROPERTY(timeOffset, double);
RCT_EXPORT_VIEW_PROPERTY(repeatCount, float);
RCT_EXPORT_VIEW_PROPERTY(repeatDuration, double);
RCT_EXPORT_VIEW_PROPERTY(autoreverses, BOOL);
RCT_EXPORT_VIEW_PROPERTY(fillMode, NSString*);

@end
