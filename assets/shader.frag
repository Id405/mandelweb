// As all shader code does, this code sucks. I could make this better, but I won't.
precision highp float;

uniform vec2 iResolution;

uniform float scale;
uniform float iterations;
uniform vec2 transl;
uniform vec2 trap;

uniform float contrast;
uniform vec2 g1;
uniform vec2 g2;

vec2 map(vec2 value, vec2 inMin, vec2 inMax, vec2 outMin, vec2 outMax) {
  return outMin + (outMax - outMin) * (value - inMin) / (inMax - inMin);
}

// https://github.com/hughsk/glsl-hsv2rgb/blob/master/index.glsl
vec3 hsv2rgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

vec2 multComplex(vec2 p1, vec2 p2) {
    return vec2(p1.x * p2.x - p1.y * p2.y, p1.x * p2.y + p1.y * p2.x);
}

vec3 iterate(vec2 c) {
    float minPointTrap = 10000000.0;
    
    float bailout = 2.0;
    vec2 z = vec2(0.0);
    float i = 0.0;
    
    for(float index = 0.0; index < 1000.0; index++) {	
        if(i >= iterations) { //Ugly webgl hack
            break;
        }

        z = multComplex(z, z) + c;
        if(length(z) > bailout) {
            break;
        }
	
        float pointTrap = distance(z, trap);
        minPointTrap = min(minPointTrap, pointTrap);

        i = index;
    }
    
    float value = i/iterations;
    // minPointTrap = sqrt(minPointTrap)*contrast*iterations;
    
    return hsv2rgb(vec3(value/2.0 + 0.5, 1.0 - value, value));
    // return vec3(minPointTrap);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
    vec2 c = (fragCoord - iResolution.xy/2.0)/iResolution.x;
    
    c *= vec2(scale);
    c += vec2(transl);
    
    fragColor = vec4(iterate(c), 1.0);
}

void main() { // Call shadertoy main function since this shader was originally written on shadertoy
	mainImage(gl_FragColor, gl_FragCoord.xy);
}