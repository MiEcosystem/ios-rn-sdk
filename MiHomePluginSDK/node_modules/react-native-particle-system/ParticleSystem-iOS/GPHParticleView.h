#import <UIKit/UIKit.h>
#import <QuartzCore/QuartzCore.h>
#import "RCTView.h"

@interface GPHParticleView : RCTView

+(Class)layerClass;

@property (nonatomic) float birthRate;

@property (nonatomic) float lifetime;

@property (nonatomic) CGPoint emitterPosition;
@property (nonatomic) CGFloat emitterZPosition;
@property (nonatomic) CGSize emitterSize;
@property (nonatomic) CGFloat emitterDepth;

@property (nonatomic, copy) NSString *emitterShape;
@property (nonatomic, copy) NSString *emitterMode;
@property (nonatomic, copy) NSString *renderMode;

@property (nonatomic) BOOL preservesDepth;
@property (nonatomic) float velocity;
@property (nonatomic) float scale;

@property (nonatomic) float spin;
@property (nonatomic) unsigned int seed;


@end
