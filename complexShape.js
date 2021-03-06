var p1 = new Point2D(0, 0);
var p2 = new Point2D(-1, 0.5);
var p3 = new Point2D(-2, 2);
var p4 = new Point2D(-1.5, 0.5);
var p5 = new Point2D(-3, 1);
var p6 = new Point2D(-2, 0);
var p7 = new Point2D(0, -0.5);
var p8 = new Point2D(1.5, 0.5);
var p9 = new Point2D(0, -1);
var p10 = new Point2D(-1.5, -0.5);
var p11 = new Point2D(-0.5, -1.5);
var p12 = new Point2D(2, 0);
var p13 = new Point2D(1.5, 2);
var p14 = new Point2D(0.5, 4);
var p15 = new Point2D(-1.5, 4.5);
var p16 = new Point2D(1.5, 4.5);
var p17 = new Point2D(4, 3.5);
var p18 = new Point2D(4.5, 2.5);
var p19 = new Point2D(3.5, 1.5);
var p20 = new Point2D(3.5, -1);
var p21 = new Point2D(2, -2);
var p22 = new Point2D(1, -3.5);
var p23 = new Point2D(0, -4.5);
var p24 = new Point2D(-2.5, -3.5);
var p25 = new Point2D(-1.5, -5);
var p26 = new Point2D(0.5, -5);
var p27 = new Point2D(2.5, -3);
var p28 = new Point2D(2.5, -3.5);
var p29 = new Point2D(1.5, -4.5);
var p30 = new Point2D(1.5, -5);
var p31 = new Point2D(2, -5);
var p32 = new Point2D(3, -3.5);
var p33 = new Point2D(3, -2.5);
var p34 = new Point2D(4, -1.5);
var p35 = new Point2D(4, 1);
var p36 = new Point2D(5, 2.5);
var p37 = new Point2D(4.5, 4);
var p38 = new Point2D(1.5, 5);
var p39 = new Point2D(-1.5, 5);
var p40 = new Point2D(-2, 4.5);
var p41 = new Point2D(-3, 4);
var p42 = new Point2D(-4.5, 1.5);
var p43 = new Point2D(-5, 1);
var p44 = new Point2D(-5, -1);
var p45 = new Point2D(-3.5, -2);
var p46 = new Point2D(-4.5, 0.5);
var p47 = new Point2D(-3.5, 2.5);
var p48 = new Point2D(-2, 4);
var p49 = new Point2D(0, 3.5);
var p50 = new Point2D(1, 1.5);
var p51 = new Point2D(0, 2.5);
var p52 = new Point2D(-1, 3);
var p53 = new Point2D(-3, 2.5);
var p54 = new Point2D(-4, 0.5);
var p55 = new Point2D(-3, -2);
var p56 = new Point2D(-2, -3.5);
var p57 = new Point2D(0.5, -3.5);
var p58 = new Point2D(0.5, -3);
var p59 = new Point2D(-1.5, -3);
var p60 = new Point2D(-2.5, -2);
var p61 = new Point2D(-0.5, -2.5);
var p62 = new Point2D(3, -0.5);
var p63 = new Point2D(2.5, 2);
var p64 = new Point2D(3.5, 2.5);
var p65 = new Point2D(3.5, 2);
var p66 = new Point2D(4, 2.5);
var p67 = new Point2D(3.5, 3);
var p68 = new Point2D(2, 3);
var p69 = new Point2D(1, 4);
var p70 = new Point2D(2, 2);
var p71 = new Point2D(2.5, 0);
var p72 = new Point2D(-0.5, -2);
var p73 = new Point2D(-1.5, -1.5);
var p74 = new Point2D(-2.5, -0.5);
var p75 = new Point2D(-2, -1.5);
var p76 = new Point2D(-3.5, 0);
var p77 = new Point2D(-3, 2);
var p78 = new Point2D(-1, 2.5);
var p79 = new Point2D(0.5, 1.5);

var pointsArray = [p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12, p13, p14, p15, p16, p17, p18, p19, p20, p21, p22, p23, p24, p25, p26, p27, p28, p29, p30, p31, p32, p33, p34, p35, p36, p37, p38, p39, p40, p41, p42, p43, p44, p45, p46, p47, p48, p49, p50, p51, p52, p53, p54, p55, p56, p57, p58, p59, p60, p61, p62, p63, p64, p65, p66, p67, p68, p69, p70, p71, p72, p73, p74, p75, p76, p77, p78, p79];

var profile2d = new Profile2D(pointsArray);

var mesh = GeometryModeler.extrudeProfile([0, 0, 0], 0.1, profile2d, [0.1, 0.6, 0.3]);