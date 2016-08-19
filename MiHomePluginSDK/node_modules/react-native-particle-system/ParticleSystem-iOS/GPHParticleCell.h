#import <UIKit/UIKit.h>

@interface GPHParticleCell : UIView

@property (nonatomic) CAEmitterCell *emitterCell;
@property (nonatomic) BOOL enabled;
@property (nonatomic, copy) void (^emitterSetupCompletion)(CAEmitterCell*);
@end
