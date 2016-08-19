#import "GPHParticleView.h"
#import "GPHParticleCell.h"

@interface GPHParticleView ()

@property (nonatomic, readonly) CAEmitterLayer *emitterLayer;
@property (nonatomic) NSArray<CAEmitterCell*> *emitterCells;

@end

@implementation GPHParticleView

@dynamic velocity, scale, lifetime, birthRate, spin, seed, emitterZPosition, preservesDepth;
@dynamic emitterShape, emitterDepth, emitterMode, renderMode, emitterPosition, emitterSize;

+(Class)layerClass
{
  return [CAEmitterLayer class];
}

-(id)initWithFrame:(CGRect)frame
{
  self = [super initWithFrame:frame];
  self.emitterLayer.emitterCells = @[];
  self.backgroundColor = [UIColor clearColor];
  self.layer.needsDisplayOnBoundsChange = YES;
  self.clipsToBounds = NO;
  self.emitterCells = @[];
  return self;
}

- (void)setFrame:(CGRect)frame
{
  [super setFrame:frame];
}

- (CAEmitterLayer*)emitterLayer
{
  return (CAEmitterLayer *)self.layer;
}

-(void)setBirthRate:(float)birthRate
{
  self.emitterLayer.birthRate = birthRate;
}

-(void)setLifetime:(float)lifetime
{
  self.emitterLayer.lifetime = lifetime;
}

-(void)setEmitterPosition:(CGPoint)position
{
  self.emitterLayer.emitterPosition = position;
}

-(void)setEmitterZPosition:(CGFloat)zPosition
{
  self.emitterLayer.emitterZPosition = zPosition;
}

-(void)setEmitterSize:(CGSize)size
{
  self.emitterLayer.emitterSize = size;
}

-(void)setEmitterDepth:(CGFloat)depth
{
  self.emitterLayer.emitterDepth = depth;
}

-(void)setEmitterShape:(NSString *)shape
{
  self.emitterLayer.emitterShape = shape;
}

-(void)setEmitterMode:(NSString *)mode
{
  self.emitterLayer.emitterMode = mode;
}

-(void)setRenderMode:(NSString *)renderMode
{
  self.emitterLayer.renderMode = renderMode;
}

-(void)setPreservesDepth:(BOOL)flag
{
  self.emitterLayer.preservesDepth = flag;
}

-(void)setVelocity:(float)velocity
{
  self.emitterLayer.velocity = velocity;
}

-(void)setScale:(float)scale
{
  self.emitterLayer.scale = scale;
}

-(void)setSpin:(float)spin
{
  self.emitterLayer.spin = spin;
}

-(void)setSeed:(uint32_t)seed
{
  self.emitterLayer.seed = seed;
}

- (void)insertSubview:(UIView *)view atIndex:(NSInteger)index
{
  if ([view isKindOfClass:[GPHParticleCell class]]) {
    GPHParticleCell *particleCell = (GPHParticleCell*) view;
    
    particleCell.emitterSetupCompletion = ^(CAEmitterCell *cell) {
      dispatch_async(dispatch_get_main_queue(), ^{
       self.emitterLayer.emitterCells = [self.emitterLayer.emitterCells arrayByAddingObject:cell];
        [self.layer setNeedsDisplay];
     });
    };
    return;
  }
  
  [super insertSubview:view atIndex:index];
}

- (void)addSubview:(UIView *)view
{
    [self insertSubview:view atIndex:[self.subviews count]];
}

- (void)insertSubview:(UIView *)view aboveSubview:(UIView *)siblingSubview
{
    NSInteger index = [self.subviews indexOfObject:siblingSubview];
    
    NSAssert(index != NSNotFound, @"Sibling subview not found");
    
    [self insertSubview:view atIndex:index+1];
}

- (void)insertSubview:(UIView *)view belowSubview:(UIView *)siblingSubview
{
    NSInteger index = [self.subviews indexOfObject:siblingSubview];
    
    NSAssert(index != NSNotFound, @"Sibling subview not found");
    
    [self insertSubview:view atIndex:index];
}

@end
