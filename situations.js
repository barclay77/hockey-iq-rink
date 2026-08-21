/* ============================================================
   HOCKEY IQ RINK - SITUATION DATA. This file is the ONLY source of truth.
   index.html names no situation and decides no order: add a situation here,
   reload, and it appears. Everything a situation needs lives on the situation: phase, about, order,
   ages, roster, coach, variants, and its own quiz, roles, videos, keywords and
   next-step links. See situations.SCHEMA.md for the format, the
   coordinate system and the rink landmark constants.

   Loaded as a PLAIN SCRIPT before the main app script, never fetched as JSON -
   the app reads SITUATIONS[0] at parse time.

   Coordinates are FEET on a 200 x 85 sheet. x=0 is our end boards, x=200 is
   theirs; we always defend the left and attack to the right. y=0 is the top
   boards, y=85 the bottom, y=42.5 centre ice.

   WARNING: a cue string determines its own audio id. Rewording a cue orphans
   its recorded mp3 and drops that line to robot voice until it is re-rendered.
   ============================================================ */

/* ============================================================
   RINK LANDMARKS - feet, on the 200 x 85 sheet. A generator should reference
   these rather than typing coordinates. Mirrored pairs are [ourEnd, theirEnd].
   ============================================================ */
const RINK = {
  length:200, width:85, centreY:42.5,
  cornerRadius:28,
  goalLine:[11,189],
  blueLine:[75,125],
  centreLine:100,
  centreDot:[100,42.5],
  centreCircleR:15,
  faceoffCircleR:15,
  /* the four end-zone dots, and the two neutral-zone dots per side */
  endDots:[[31,20.5],[31,64.5],[169,20.5],[169,64.5]],
  neutralDots:[[80,20.5],[80,64.5],[120,20.5],[120,64.5]],
  hashOffsetX:2.8, hashInnerY:15.4, hashOuterY:17.6,
  netMouth:[[11,42.5],[189,42.5]],
  creaseDepth:4.5, creaseHalfHeight:4,
  /* boards: y bands a generator can aim at */
  topBoards:0, bottomBoards:85,
  boardsLaneY:[[0,22],[63,85]], middleLaneY:[30,55],
  /* the three zones by x */
  ourZoneX:[0,75], neutralZoneX:[75,125], theirZoneX:[125,200],
  /* we ALWAYS defend the left and attack to the right */
  attackDirection:+1
};

const SITUATIONS = [

/* ---- Defensive zone coverage (D, order 10) ---- */
{
  id:'dzone',
  name:'Defensive zone coverage',
  group:'D',
  ages:['10U','12U','14U'],
  about:'They have it in our end. Five jobs, and nobody chases.',
  focus:[-5,-5,110,95],
  roster:['G','LD','RD','C','LW','RW'],
  variants:[
    {
      id:'corner',
      name:'Puck in the corner',
      note:'The most common thing that happens all game.',
      frames:[
        {
          t:0,
          cue:'They just got the puck in the corner. Nobody panics - everybody takes a job.',
          us:{G:[13.5,42.5], LD:[24,15], RD:[18,47], C:[26,27], LW:[45,19], RW:[41,50]},
          them:{X1:[19,11], X2:[21,41], X3:[30,38], X4:[69,22], X5:[69,60]},
          puck:[
            19.5,
            11.5,
            'X1'
          ]
        },
        {
          t:0.34,
          cue:'LD angles him into the boards. C seals the middle. Both wings stay ABOVE the puck on their points.',
          us:{LD:[30,13], C:[31,25], LW:[43,15], RD:[18,45]},
          them:{X1:[28,10], X2:[21,44], X3:[30,36]},
          puck:[
            28.5,
            10.5,
            'X1'
          ]
        },
        {
          t:0.62,
          cue:'Trapped on the wall, he throws it up the boards - and LW is standing right in that lane.',
          us:{LD:[33,13], C:[33,26], LW:[42,13]},
          them:{X1:[31,10], X3:[34,34]},
          puck:[40,12]
        },
        {
          t:0.82,
          cue:'LW knocks it down. Puck is ours, and nobody had to make a diving play.',
          us:{LW:[42,12], C:[36,28], LD:[30,16], RD:[18,44]},
          puck:[
            42,
            12.5,
            'LW'
          ]
        },
        {
          t:1,
          cue:'Now C swings into the middle as the outlet and we break out. Good coverage turns into offense.',
          us:{LW:[48,13], C:[45,31], LD:[34,20], RD:[20,44], RW:[50,56]},
          them:{X1:[38,11], X3:[40,34], X2:[26,44]},
          puck:[
            48,
            13.5,
            'LW'
          ]
        }
      ]
    },
    {
      id:'behind',
      name:'Puck behind our net',
      note:'Do NOT all dive back there. Hold the posts and the slot.',
      frames:[
        {
          t:0,
          cue:'They wrapped it behind our net. Two of us can be down there - not four.',
          us:{G:[13.5,42.5], LD:[15,36], RD:[11,52], C:[20,56], LW:[43,20], RW:[40,48]},
          them:{X1:[6,49], X2:[20,42], X3:[26,60], X4:[69,22], X5:[69,60]},
          puck:[
            6.5,
            49.5,
            'X1'
          ]
        },
        {
          t:0.35,
          cue:'He tries to come out the bottom side. RD holds the post, C takes away the wall lane.',
          us:{RD:[12,55], C:[22,62], LD:[15,38]},
          them:{X1:[9,57], X3:[28,64]},
          puck:[
            9.5,
            57.5,
            'X1'
          ]
        },
        {
          t:0.62,
          cue:'No room anywhere. He throws it to the corner and C is first one there because he never left the middle-out lane.',
          us:{C:[24,66], RD:[14,57]},
          them:{X1:[13,62], X3:[30,66]},
          puck:[24,70]
        },
        {
          t:1,
          cue:'C wins the wall race, RD covers behind him, wings turn up ice. Out we go.',
          us:{C:[26,70], RD:[16,58], LW:[44,26], RW:[46,56], LD:[16,42]},
          them:{X3:[32,68], X1:[18,64]},
          puck:[
            26,
            70,
            'C'
          ]
        }
      ]
    },
    {
      id:'point',
      name:'They are shooting from the point',
      note:'Now it is about shot lanes and bodies at the net.',
      frames:[
        {
          t:0,
          cue:'Puck up to their D at the point. A shot is coming - this is about lanes and boxing out.',
          us:{G:[13.5,42.5], LD:[24,26], RD:[18,44], C:[34,30], LW:[48,22], RW:[42,48]},
          them:{X1:[66,24], X2:[21,42], X3:[34,36], X4:[66,60], X5:[48,12]},
          puck:[
            66,
            25,
            'X1'
          ]
        },
        {
          t:0.35,
          cue:'LW closes on the shooter with his stick in the lane. C picks up the man in the high slot.',
          us:{LW:[56,23], C:[35,34], RD:[18,43], LD:[23,28]},
          them:{X1:[62,28], X3:[36,38]},
          puck:[
            62,
            29,
            'X1'
          ]
        },
        {
          t:0.62,
          cue:'Shot. RD boxes out the net front, G sees it, everybody finds a body instead of a puck.',
          us:{RD:[19,44], C:[31,36], LD:[22,30]},
          them:{X2:[22,44]},
          puck:[24,42]
        },
        {
          t:1,
          cue:'Rebound covered, G leaves it in the corner, LD picks it up. Now we are the ones with the puck.',
          us:{LD:[18,24], C:[28,44], LW:[46,20], RW:[44,52], RD:[20,44]},
          them:{X3:[32,42]},
          puck:[16,22]
        }
      ]
    }
  ],
  coach:{
    C:{
      job:'Second man low on the puck side. You are your D\'s helper and the plug in the middle of the ice.',
      look:[
        {
          n:1,
          label:'The puck - is your D winning it?',
          to:'puck'
        },
        {
          n:2,
          label:'The man sneaking into the slot behind you',
          to:'X3'
        },
        {
          n:3,
          label:'The wall - your outlet the second we win it',
          to:[45,13]
        }
      ],
      do:[
        'Stay a stick or two off your D, on the goal side of the puck.',
        'If your D wins it, you are the short pass - on the wall or in the middle.',
        'If your D gets beat, YOU take the next man low. Never both chase the same guy.',
        'Face the puck. Slide and skate backward - do not turn your back on it.'
      ],
      mistake:'Chasing the puck into the corner so three of you are on one puck and the middle is wide open. In our zone the middle is the dangerous ice, and it is yours.',
      remember:'Puck side. Goal side. Middle protected.'
    },
    LD:{
      job:'Pressure the puck carrier. Take ice away - do not just skate at him.',
      look:[
        {
          n:1,
          label:'His hands and his hips (not his eyes)',
          to:'X1'
        },
        {
          n:2,
          label:'The boards - that is where you are sending him',
          to:[36,8]
        },
        {
          n:3,
          label:'Your net - stay between the puck and it',
          to:'ourNet'
        }
      ],
      do:[
        'Approach at his OUTSIDE shoulder so his only option is the wall.',
        'Stick on the puck, body between him and the net.',
        'Win it and move it fast. First look is your wing on the wall.',
        'If you cannot win it, pin it. A pinned puck is a whistle or a change.'
      ],
      mistake:'Diving straight at him. He steps around you and the middle of the ice becomes a highway to our net.'
    },
    RD:{
      job:'Net front. Nothing gets to the paint alive.',
      look:[
        {
          n:1,
          label:'Your man in front of the net',
          to:'X2'
        },
        {
          n:2,
          label:'The puck',
          to:'puck'
        },
        {
          n:3,
          label:'The back door on your far side',
          to:[24,58]
        }
      ],
      do:[
        'Stand on the far side of your man with your stick in the passing lane.',
        'Box him out with your hips and body - it is not a hug, it is a wall.',
        'Head on a swivel: puck, man, puck, man.',
        'Do NOT leave the net to help in the corner. That is C\'s job, not yours.'
      ],
      mistake:'Watching the puck in the corner while your man slides to the back door for a tap-in.'
    },
    LW:{
      job:'Cover the strong-side point - their D at the top of the zone on your side.',
      look:[
        {
          n:1,
          label:'Their D at the point on your side',
          to:'X4'
        },
        {
          n:2,
          label:'The puck below you',
          to:'puck'
        },
        {
          n:3,
          label:'The wall lane between you and the corner',
          to:[36,10]
        }
      ],
      do:[
        'Stay ABOVE the puck. If the puck is below you, you are in the right place.',
        'Stand in the lane up the boards - most of their passes go there.',
        'Stick flat on the ice and in the lane, not up in the air.',
        'Win a loose one and you are the breakout. Get your feet going up ice.'
      ],
      mistake:'Sliding down into the corner to help. Now their point man is free at the top of the circle for a clean shot.'
    },
    RW:{
      job:'Weak-side insurance. Cover their far point, but cheat toward the middle.',
      look:[
        {
          n:1,
          label:'The high slot in the middle of the ice',
          to:[38,42]
        },
        {
          n:2,
          label:'Their far-side D at the point',
          to:'X4'
        },
        {
          n:3,
          label:'The puck',
          to:'puck'
        }
      ],
      do:[
        'Sag toward the middle - you are the last layer in front of the high slot.',
        'Stay above your check so nothing gets behind you.',
        'If the puck comes to your side, THEN you close on their point.',
        'When we win it, get to the far wall - you are the long option.'
      ],
      mistake:'Hugging the far boards doing nothing while the middle of the ice is empty.'
    },
    G:{
      job:'Track the puck, talk to your team, control your rebounds.',
      look:[
        {
          n:1,
          label:'The puck',
          to:'puck'
        },
        {
          n:2,
          label:'Bodies in front of you',
          to:'X2'
        }
      ],
      do:[
        'Square to the puck and stay on your feet as long as you can.',
        'Tell your D where the puck is - you can see things they cannot.',
        'Leave rebounds in the corner, not in the slot.'
      ],
      mistake:'Playing the puck and the screen at the same time. Pick the puck, and trust your D to move the body.'
    }
  },
  phase:'D',
  order:10,
  phases:{
    corner:['D','D','D','T','T'],
    behind:['D','D','D','T'],
    point:['D','D','D','T']
  },
  next:{
    corner:{
      sit:'breakout',
      v:'wall',
      label:'We knocked it down - the puck is ours. Now get out of our own end.'
    },
    behind:{
      sit:'breakout',
      v:'wall',
      label:'We won the wall race. Now get out of our own end.'
    },
    point:{
      sit:'breakout',
      v:'wall',
      label:'Rebound is covered. Now get out of our own end.'
    }
  },
  roles:{
    X1:'in the corner',
    X2:'net front',
    X3:'slot',
    X4:'their D',
    X5:'their D'
  },
  tests:[
    {
      q:'They have the puck in the corner and your D is going to pressure him. You are the centre. What do you do?',
      o:[
        'Go help your D in the corner - two on one',
        'Stay just off your D and cover the next man in the middle',
        'Go stand in front of your own net',
        'Take off up the ice looking for a breakaway'
      ],
      a:1,
      why:'Two of you on one puck leaves the middle empty, and the middle is where they score from. Support your D and take the next man.'
    },
    {
      q:'You are the wing on the far side from the puck. Where do you belong?',
      o:[
        'Hugging the far boards',
        'Down in the corner helping out',
        'Sagging toward the middle, above your man',
        'Behind your own net'
      ],
      a:2,
      why:'The weak-side wing is the insurance policy for the high slot. Cheat to the middle and stay above your man.'
    },
    {
      q:'You are the D in front of your own net. The puck is in the corner. What is the worst mistake you can make?',
      o:[
        'Watching the puck and losing your man',
        'Talking to your goalie',
        'Keeping your stick on the ice',
        'Boxing your man out'
      ],
      a:0,
      why:'Watch the puck and your man slips to the back door for a tap-in. Puck, man, puck, man.'
    }
  ],
  placeq:[
    {
      pos:'C',
      fr:0,
      ask:'They just got the puck in the corner. Drag YOU to where the centre belongs right now.'
    },
    {
      pos:'RD',
      fr:0,
      ask:'Now you are the D who is NOT pressuring the puck. Where do you stand?'
    }
  ],
  videos:[
    {
      id:'yRWi6vbPUbM',
      t:'Defensive Zone Coverage - The House in Hockey (Beginner)',
      c:'Coach K',
      w:'Best starting point - teaches "the house," the ice you never give up.'
    },
    {
      id:'IVImTLlzFv8',
      t:'Defensive Zone Positioning & Net Front Coverage',
      c:'Secret Sauce Hockey',
      w:'Exactly the RD net-front job: box out, stick in the lane.'
    },
    {
      id:'cCjmKSmz4Ss',
      t:'D Zone Coverage Basics',
      c:'Hockey Coach Vision',
      w:'Animated basics. Pause it and match it to the rink above.'
    },
    {
      id:'A3S5Df9o2Y8',
      t:'How to Collapse the D-Zone',
      c:'Francis Hockey Development',
      w:'The low-zone layer once the box makes sense.'
    },
    {
      id:'h131UnupxtQ',
      t:'Glen Gulutzan - 3 Types of NHL Defensive Zone Coverage',
      c:'The Coaches Site',
      w:'Man vs zone vs hybrid. For the parent, not the kid.'
    }
  ],
  searchq:'hockey defensive zone coverage',
  keys:{
    base:[
      'd zone',
      'dzone',
      'd-zone',
      'defensive zone',
      'defending our zone',
      'coverage',
      'low zone',
      'the house',
      'our end',
      'our zone',
      'defend',
      'collapse',
      'net front',
      'box out',
      'defensive coverage'
    ],
    v:{
      corner:['corner','wall','down low','below the dots','low'],
      behind:[
        'behind the net',
        'behind our net',
        'wrap',
        'wrap around',
        'goal line',
        'below the goal line'
      ],
      point:[
        'point',
        'from the point',
        'shot from the point',
        'block shots',
        'shot lane',
        'high slot',
        'walk the line'
      ]
    }
  }
},

/* ---- Forecheck (D, order 20) ---- */
{
  id:'forecheck',
  name:'Forecheck',
  group:'D',
  ages:['10U','12U','14U','16U'],
  about:'They have it in their end. We go get it back.',
  focus:[100,-5,107,95],
  roster:['C','LW','RW','LD','RD'],
  variants:[
    {
      id:'122',
      name:'1-2-2 (one in, contain)',
      note:'Safe and smart. One pressures, two support, two D hold the line.',
      frames:[
        {
          t:0,
          cue:'Their D has it behind the net. You are F1 - the first one in. Your job is to take away half the ice.',
          us:{C:[178,32], LW:[168,18], RW:[158,44], LD:[140,24], RD:[140,60]},
          them:{XG:[187,42.5], X1:[194,36], X2:[194,50], X3:[176,10], X4:[176,74], X5:[166,44]},
          puck:[
            194,
            36.5,
            'X1'
          ]
        },
        {
          t:0.32,
          cue:'C angles at his OUTSIDE shoulder. Not straight at him - you are herding him up the boards.',
          us:{C:[186,26], LW:[172,14], RW:[160,42]},
          them:{X1:[192,28], X3:[178,10]},
          puck:[
            192,
            28.5,
            'X1'
          ]
        },
        {
          t:0.55,
          cue:'He has one option left - the wall. He takes it. Now F2 attacks, and LW was already above and inside.',
          us:{C:[188,22], LW:[176,12], RW:[162,40]},
          them:{X1:[190,24], X3:[180,10], X5:[168,40]},
          puck:[181,10]
        },
        {
          t:0.78,
          cue:'LW arrives WITH the puck, not after it. C spins low as support, RW never left the middle.',
          us:{LW:[180,11], C:[186,18], RW:[160,42], LD:[142,26], RD:[142,58]},
          them:{X3:[184,12], X5:[170,38], X1:[188,22]},
          puck:[
            180,
            11.5,
            'LW'
          ]
        },
        {
          t:1,
          cue:'Turnover below their circles. That is the best offense in hockey - you did not even have to carry it in.',
          us:{LW:[180,14], C:[180,24], RW:[166,44], LD:[136,28], RD:[136,56]},
          them:{X3:[188,14], X5:[172,36], X2:[190,50]},
          puck:[
            180,
            14.5,
            'LW'
          ]
        }
      ]
    },
    {
      id:'212',
      name:'2-1-2 (send two, aggressive)',
      note:'More pressure, more risk. You need your D awake at the line.',
      frames:[
        {
          t:0,
          cue:'Coach wants pressure. Two of you go in hard, one stays high, D hold the line.',
          us:{C:[178,56], LW:[178,30], RW:[158,42], LD:[138,26], RD:[138,60]},
          them:{XG:[187,42.5], X1:[194,50], X2:[194,36], X3:[176,10], X4:[176,74], X5:[166,44]},
          puck:[
            194,
            50.5,
            'X1'
          ]
        },
        {
          t:0.32,
          cue:'C takes the puck carrier, LW takes the other D. There is no free outlet behind the net now.',
          us:{C:[188,52], LW:[188,32], RW:[160,42]},
          them:{X1:[193,54], X2:[192,32]},
          puck:[
            193,
            54.5,
            'X1'
          ]
        },
        {
          t:0.6,
          cue:'Panic pass up the middle - and RW is standing exactly there, because he stayed high like he was supposed to.',
          us:{RW:[166,44], C:[188,56], LW:[186,30]},
          them:{X5:[170,46], X1:[190,56]},
          puck:[168,45]
        },
        {
          t:1,
          cue:'RW has it in the slot with speed. That is what aggressive forechecking buys you - if your F3 is honest.',
          us:{RW:[174,44], C:[184,52], LW:[184,30], LD:[140,30], RD:[140,56]},
          them:{X5:[166,48], X3:[178,16]},
          puck:[
            174,
            44.5,
            'RW'
          ]
        }
      ]
    },
    {
      id:'f2',
      name:'You are F2, not F1',
      note:'The read that separates good centers from puck-chasers.',
      frames:[
        {
          t:0,
          cue:'Your winger got there first, so today you are F2. Your entire job is reading which way he forces the puck.',
          us:{LW:[180,34], C:[170,22], RW:[158,50], LD:[140,26], RD:[140,60]},
          them:{XG:[187,42.5], X1:[194,36], X2:[194,52], X3:[176,10], X4:[176,74], X5:[166,44]},
          puck:[
            194,
            36.5,
            'X1'
          ]
        },
        {
          t:0.3,
          cue:'LW forces him up the TOP side. That is your key - go to the top wall, above and inside your man.',
          us:{LW:[188,28], C:[174,14], RW:[160,46]},
          them:{X1:[192,28], X3:[178,10]},
          puck:[
            192,
            28.5,
            'X1'
          ]
        },
        {
          t:0.6,
          cue:'The pass goes to the wall and you meet it. Stick first, body second.',
          us:{C:[178,11], LW:[188,24]},
          them:{X3:[180,10]},
          puck:[179,10.5]
        },
        {
          t:1,
          cue:'You won the wall. LW becomes low support, RW never left the middle. Layers, not a pile.',
          us:{C:[178,14], LW:[184,20], RW:[162,44], LD:[138,28], RD:[138,58]},
          them:{X3:[184,10], X5:[168,42]},
          puck:[
            178,
            14.5,
            'C'
          ]
        }
      ]
    }
  ],
  coach:{
    C:{
      job:'Usually F1 - the first man in. You do not win the puck, you take away options.',
      look:[
        {
          n:1,
          label:'The puck carrier\'s hips - they tell you where he is going',
          to:'X1'
        },
        {
          n:2,
          label:'The side you are taking away',
          to:[188,52]
        },
        {
          n:3,
          label:'Your F2 - he is reading YOU',
          to:'LW'
        }
      ],
      do:[
        'Skate at his outside shoulder, not at his chest. Give him one way to go: the boards.',
        'Go hard but under control. Arriving out of gas is the same as not arriving.',
        'Stick on the ice in front of you to take away the pass across.',
        'If you get beat, do not stop - become the low support man immediately.'
      ],
      mistake:'Charging straight down the middle at him. He goes around you, you are behind the play, and now your D are outnumbered.',
      remember:'Angle, do not chase. Take half the ice away.'
    },
    LW:{
      job:'F2 - the second man. Read where F1 forced the puck and attack that spot.',
      look:[
        {
          n:1,
          label:'F1 - which way is he forcing it?',
          to:'C'
        },
        {
          n:2,
          label:'The first pass option on your wall',
          to:'X3'
        },
        {
          n:3,
          label:'Above and inside - do not get beat up ice',
          to:[160,20]
        }
      ],
      do:[
        'Stay above and inside your man so he cannot go up the wall past you.',
        'Time it: arrive when the puck arrives, not two seconds later.',
        'If F1 forced it your way, you attack. If not, you hold and stay high.',
        'Win the wall and the puck is ours in the best place on the ice.'
      ],
      mistake:'Going in at the same time as F1 so you both hit the same guy and their winger walks out the other side.'
    },
    RW:{
      job:'F3 - high in the middle. You are the reason a mistake does not become a breakaway.',
      look:[
        {
          n:1,
          label:'The middle lane in front of you',
          to:[152,42]
        },
        {
          n:2,
          label:'The puck below you',
          to:'puck'
        },
        {
          n:3,
          label:'Their forward looking for the middle',
          to:'X5'
        }
      ],
      do:[
        'Sit around the top of the circles, in the middle of the ice.',
        'Stay ABOVE the puck. Nothing gets behind you.',
        'Read for the puck that squirts out to the middle - that one is yours.',
        'When we win it low, you are the one who is open in the slot.'
      ],
      mistake:'Diving in to make it three-on-one down low. Now the middle is empty and their team has a rush.'
    },
    LD:{
      job:'Hold the line, stay above the puck, keep the play in front of you.',
      look:[
        {
          n:1,
          label:'The puck',
          to:'puck'
        },
        {
          n:2,
          label:'Their winger sneaking behind you',
          to:'X3'
        },
        {
          n:3,
          label:'Your partner - stay connected',
          to:'RD'
        }
      ],
      do:[
        'Walk the blue line with the puck. Do not stand in one spot.',
        'Keep everything in front of you - never let a man get behind you.',
        'If the puck comes to you at the line, keep it in and shoot or move it low.',
        'Talk with your partner so one of you is always higher.'
      ],
      mistake:'Chasing a loose puck into the corner and leaving the blue line wide open behind you.'
    },
    RD:{
      job:'The safety. You are the last one back and the play never gets past you.',
      look:[
        {
          n:1,
          label:'Their fastest forward',
          to:'X4'
        },
        {
          n:2,
          label:'The puck',
          to:'puck'
        },
        {
          n:3,
          label:'The middle of the neutral zone',
          to:[130,42]
        }
      ],
      do:[
        'Stay a little higher than your partner. One of you is always the safety.',
        'Skate backward and keep your feet moving so you never get flat-footed.',
        'When we win it, jump up the ice - that is when you become an option.',
        'When we lose it, you are already turned and going.'
      ],
      mistake:'Both D at the same depth. One bounce and it is two-on-one the other way.'
    }
  },
  phase:'D',
  order:20,
  phases:{
    '122':['D','D','D','T','O'],
    '212':['D','D','T','O'],
    f2:['D','D','T','O']
  },
  next:{
    '122':{
      sit:'ozone',
      v:'cycle',
      label:'We stole it below their circles. Now hang on to it.'
    },
    '212':{
      sit:'ozone',
      v:'drive',
      label:'We have it in the slot with speed. Go to the net.'
    },
    f2:{
      sit:'ozone',
      v:'cycle',
      label:'You won the wall. Now play offense down low.'
    }
  },
  roles:{
    X1:'their D',
    X2:'their D',
    X3:'their wing',
    X4:'their wing',
    X5:'their centre',
    XG:'goalie'
  },
  tests:[
    {
      q:'You are F1 - first man in. Their D has the puck behind the net. How do you skate at him?',
      o:[
        'Straight at his chest as fast as you can',
        'At his outside shoulder so his only option is the boards',
        'Stop at the top of the circle and wait',
        'Loop around behind the net the other way'
      ],
      a:1,
      why:'F1 does not have to win the puck. F1 takes away half the ice. Angle him to the wall and let F2 win it.'
    },
    {
      q:'You are F3, high in the middle. They throw the puck up the boards. What do you do?',
      o:[
        'Race to the corner to help',
        'Hold the middle and stay above the puck',
        'Go to the front of their net',
        'Skate back to our end'
      ],
      a:1,
      why:'F3 is the reason a mistake does not turn into a breakaway against us. Nothing gets behind you.'
    },
    {
      q:'Your winger got there first, so today you are F2. What tells you where to go?',
      o:[
        'Where the goalie is looking',
        'Which way F1 forced the puck',
        'Where our D are standing',
        'Wherever there is open ice'
      ],
      a:1,
      why:'F2 reads F1. If F1 forced it up the top wall, you attack the top wall - above and inside your man.'
    }
  ],
  placeq:[
    {
      pos:'C',
      fr:0,
      ask:'You are F1 going in on their D. Where do you start your angle from?'
    },
    {
      pos:'RW',
      fr:1,
      ask:'You are F3, the high forward. Put yourself where F3 belongs.'
    }
  ],
  videos:[
    {
      id:'-skgropbRuI',
      t:'The Roles of F1, F2 and F3 in Forechecking',
      c:'Rink Tactics',
      w:'Watch this one FIRST, before any system name.'
    },
    {
      id:'G-_LNRd_fDo',
      t:'1-2-2 Forechecking System',
      c:'Weiss Tech Hockey',
      w:'Matches the 1-2-2 variant on the rink above.'
    },
    {
      id:'gku-uLmPx_g',
      t:'2-1-2 Forecheck Explanation',
      c:'Weiss Tech Hockey',
      w:'Matches the 2-1-2 variant. Same coach, same vocabulary.'
    },
    {
      id:'wb6MwBW-zJ0',
      t:'How to Teach Hockey Angling Skills From the Basics',
      c:'Hockey Extreme',
      w:'Angling is the whole F1 job. This teaches it from zero.'
    },
    {
      id:'TRGkGVUdTNA',
      t:'David Urquhart - Angling and How to Teach It',
      c:'Hockey Eastern Ontario',
      w:'Minor-hockey angling progression you can run in the driveway.'
    },
    {
      id:'fTa7uBiEDQM',
      t:'Teaching Forechecking Fundamentals - Greg Cronin',
      c:'The Coaches Site',
      w:'Fundamentals-first framing for coaches.'
    }
  ],
  searchq:'hockey forecheck F1 F2 F3',
  keys:{
    base:[
      'forecheck',
      'fore check',
      'forechecking',
      'pressure them',
      'f1',
      'f2',
      'f3',
      'angle',
      'angling',
      'their end',
      'their zone',
      'pressure in their end',
      'get it back',
      'chase'
    ],
    v:{
      '122':['1-2-2','122','one two two','contain','passive','one in','conservative'],
      '212':['2-1-2','212','two one two','aggressive','send two','two in','heavy'],
      f2:['f2','second man','second man in','support man','read the forecheck']
    }
  }
},

/* ---- Defending the rush (D, order 30) ---- */
{
  id:'rush',
  name:'Defending the rush',
  phase:'D',
  ages:['12U','14U','16U','18U'],
  about:'They are carrying it at us. Squeeze them at the line.',
  focus:[46,-5,112,95],
  roster:['C','LW','RW','LD','RD'],
  variants:[
    {
      id:'gap',
      name:'Gap control',
      note:'Tracking back through the middle is a center\'s hardest habit.',
      frames:[
        {
          t:0,
          cue:'They have it and they are coming. Now it is about gap and staying above the puck.',
          us:{LD:[84,32], RD:[84,54], C:[96,44], LW:[104,16], RW:[104,68]},
          them:{X1:[112,42], X2:[118,14], X3:[118,70], X4:[128,34], X5:[128,54]},
          puck:[
            112,
            42.5,
            'X1'
          ]
        },
        {
          t:0.32,
          cue:'D skate backward TOGETHER with a short gap - a stick length, not ten feet. C tracks back through the middle.',
          us:{LD:[78,34], RD:[78,52], C:[88,44], LW:[96,16], RW:[96,68]},
          them:{X1:[100,42], X2:[106,14], X3:[106,70]},
          puck:[
            100,
            42.5,
            'X1'
          ]
        },
        {
          t:0.6,
          cue:'C stays on the puck carrier\'s inside hip all the way back. Nobody gets a free ride through the middle.',
          us:{C:[80,42], LD:[72,34], RD:[72,52], LW:[84,14], RW:[84,70]},
          them:{X1:[86,42], X2:[92,14], X3:[92,70]},
          puck:[
            86,
            42.5,
            'X1'
          ]
        },
        {
          t:1,
          cue:'Squeezed at the blue line with nowhere to go but the boards. We win it back without a single big hit.',
          us:{LD:[70,36], RD:[70,50], C:[76,42], LW:[78,12], RW:[78,72]},
          them:{X1:[78,40], X2:[80,12], X3:[82,68]},
          puck:[76,38]
        }
      ]
    }
  ],
  coach:{
    C:{
      job:'Track back through the middle and stay on the puck carrier’s inside hip.',
      look:[
        {
          n:1,
          label:'The puck carrier',
          to:'puck'
        },
        {
          n:2,
          label:'The middle lane behind you',
          to:[70,42]
        },
        {
          n:3,
          label:'Your D - do not skate past them',
          to:'LD'
        }
      ],
      do:[
        'Turn and go the instant we lose the puck. First three strides decide everything.',
        'Skate to his inside hip, between him and the middle of the ice.',
        'Never let a puck carrier come up the middle untouched.',
        'Stay above the puck. If you end up below it, you are no help to anyone.'
      ],
      mistake:'Coasting back, or drifting to the boards where your winger already is, so the middle of the ice is a free lane.',
      remember:'Turn, go, inside hip.'
    },
    LW:{
      job:'Pick up their winger on your side and stay above him.',
      look:[
        {
          n:1,
          label:'Your man on your side',
          to:'X2'
        },
        {
          n:2,
          label:'The puck',
          to:'puck'
        },
        {
          n:3,
          label:'Your own blue line',
          to:[75,14]
        }
      ],
      do:[
        'Find your man early, not when the puck is already there.',
        'Stay above him so nothing gets behind you.',
        'Take away the pass to the wall with your stick.',
        'If they turn it over, you are the first outlet - be ready to go.'
      ],
      mistake:'Watching the puck all the way back so their winger walks in behind you.'
    },
    RW:{
      job:'Same job on your side. Your man is the winger closest to you.',
      look:[
        {
          n:1,
          label:'Your man on your side',
          to:'X3'
        },
        {
          n:2,
          label:'The puck',
          to:'puck'
        },
        {
          n:3,
          label:'The middle of the ice',
          to:[80,42]
        }
      ],
      do:[
        'Match your winger stride for stride and stay above him.',
        'Do not cross into the middle - that is your centre’s lane.',
        'Stick in the passing lane, body between him and our net.',
        'The second we win it, sprint wide. Odd-man rushes start here.'
      ],
      mistake:'Cutting into the middle to chase the puck and leaving your man wide open on the wall.'
    },
    LD:{
      job:'Control the gap. Short, even, and skating backward with your partner.',
      look:[
        {
          n:1,
          label:'The puck carrier',
          to:'puck'
        },
        {
          n:2,
          label:'Your partner - same depth as you',
          to:'RD'
        },
        {
          n:3,
          label:'The boards - where you want to send him',
          to:[70,10]
        }
      ],
      do:[
        'Keep the gap about a stick length. Close enough to touch him.',
        'Skate backward hard so you never get flat-footed and beaten wide.',
        'Angle him toward the boards. The middle is where they score from.',
        'Step up at the blue line when you can - killing it there is worth a lot.'
      ],
      mistake:'Backing all the way in to your own goal line. You just gave them the entire zone for free.',
      remember:'Short gap. Feet moving. Boards, not middle.'
    },
    RD:{
      job:'Stay tied to your partner so there is no hole to pass through.',
      look:[
        {
          n:1,
          label:'Your partner',
          to:'LD'
        },
        {
          n:2,
          label:'The puck carrier',
          to:'puck'
        },
        {
          n:3,
          label:'The far side in case it goes across',
          to:[80,66]
        }
      ],
      do:[
        'Mirror your partner - same depth, same speed, side by side.',
        'Talk: "I got him", "switch", "step up".',
        'Watch for the pass across. That is their best play against two D.',
        'Keep your head up so you never turn your back on the puck.'
      ],
      mistake:'Drifting to a different depth than your partner, which opens a lane straight between you.'
    },
    G:{
      job:'Read the rush and be set early.',
      look:[
        {
          n:1,
          label:'The puck',
          to:'puck'
        },
        {
          n:2,
          label:'The far side for a pass across',
          to:'X3'
        }
      ],
      do:[
        'Be set before he crosses the blue line.',
        'Call out odd-man rushes to your D.',
        'Play the shooter and trust your D to take the pass.'
      ],
      mistake:'Still moving across when the shot comes.'
    }
  },
  order:30,
  group:'D',
  phases:{
    gap:['D','D','D','D']
  },
  next:{
    gap:{
      sit:'dzone',
      v:'corner',
      label:'They got it in deep on us. Now it is defensive zone coverage.'
    }
  },
  roles:{
    X1:'carrying it',
    X2:'their wing',
    X3:'their wing',
    X4:'their D',
    X5:'their D'
  },
  tests:[
    {
      q:'They are coming at you with the puck. You and your partner are the two D. What is a good gap?',
      o:[
        'Ten or fifteen feet so you have room to react',
        'About a stick length, and both of you at the same depth',
        'Right in his face at the red line',
        'All the way back to your own goal line'
      ],
      a:1,
      why:'A short, even gap gives him nowhere to go. Backing all the way in hands them the whole zone for free.'
    },
    {
      q:'You are the centre coming back through the neutral zone. Where do you skate?',
      o:[
        'To the boards to help your winger',
        'Straight to the front of our net',
        'On the puck carrier’s inside hip, in the middle lane',
        'Stay at their blue line in case we get it back'
      ],
      a:2,
      why:'The middle lane is yours in both directions. Track back on his inside hip so nobody gets a free ride up the gut.'
    }
  ],
  placeq:[
    {
      pos:'C',
      fr:1,
      ask:'They are coming at us. Put the centre where he belongs on the way back.'
    },
    {
      pos:'LD',
      fr:1,
      ask:'Put the left D at the right gap on this rush.'
    }
  ],
  videos:[
    {
      id:'hLwcEyma7L8',
      t:'Gap Control for Defense in Hockey',
      c:'Train 2.0 Hockey',
      w:'The core D habit. Short gap, feet moving.'
    },
    {
      id:'eAp5CrhyNeU',
      t:'Stop Getting Beat Wide - Gap Control Explained (Full Lesson)',
      c:'STL Hockey Training',
      w:'Fixes the single most common U10 defensive error.'
    }
  ],
  searchq:'hockey gap control defending the rush',
  keys:{
    base:[
      'gap',
      'gap control',
      'defend the rush',
      'defending the rush',
      'rush against',
      'back check',
      'backcheck',
      'coming at us',
      'neutral zone defence',
      'neutral zone defense',
      'odd man',
      '2 on 1',
      'two on one',
      '3 on 2',
      'three on two',
      'beat wide',
      'track back'
    ],
    v:{
      gap:['gap','tight gap','stand up','blue line']
    }
  }
},

/* ---- Penalty kill (4 on 5) (D, order 40) ---- */
{
  id:'pk',
  name:'Penalty kill (4 on 5)',
  group:'D',
  ages:['12U','14U','16U','18U'],
  about:'Down a man. Four players, one box.',
  focus:[-5,-5,100,95],
  roster:['G','LD','RD','C','LW'],
  variants:[
    {
      id:'box',
      name:'The box - move as one unit',
      note:'RW is on the bench. Four skaters only.',
      frames:[
        {
          t:0,
          cue:'Down a man. Four of you make a box, and the box slides as ONE piece.',
          us:{G:[13.5,42.5], C:[40,32], LW:[40,53], LD:[24,32], RD:[24,53]},
          them:{X1:[52,42.5], X2:[30,20], X3:[30,65], X4:[34,42.5], X5:[18,42.5]},
          puck:[
            52,
            42.5,
            'X1'
          ]
        },
        {
          t:0.3,
          cue:'Puck goes to the top-side half wall. The whole box slides that way together. Nobody freelances.',
          us:{C:[38,26], LW:[38,48], LD:[24,27], RD:[24,48]},
          them:{X2:[32,18]},
          puck:[
            32,
            18.5,
            'X2'
          ]
        },
        {
          t:0.55,
          cue:'NOW C can pressure - the puck is on his side and he can actually get there. Stick in the shot lane.',
          us:{C:[33,22], LD:[23,26], LW:[36,46], RD:[24,46]},
          them:{X2:[31,17], X4:[34,40]},
          puck:[
            31,
            17.5,
            'X2'
          ]
        },
        {
          t:0.8,
          cue:'Forced back to the point. Box resets to the middle. You just killed eight seconds - that is a win.',
          us:{C:[38,32], LW:[38,52], LD:[24,32], RD:[24,52]},
          them:{X2:[30,20]},
          puck:[
            50,
            42.5,
            'X1'
          ]
        },
        {
          t:1,
          cue:'Next puck near you, look for the clear. Off the glass and out is a perfect play - it does not have to be pretty.',
          us:{C:[42,30], LD:[25,32], RD:[24,52], LW:[38,52]},
          puck:[70,10]
        }
      ]
    }
  ],
  coach:{
    C:{
      job:'Top of the box on your side. Pressure only when you can actually get there.',
      look:[
        {
          n:1,
          label:'The puck',
          to:'puck'
        },
        {
          n:2,
          label:'The bumper in the middle behind you',
          to:'X4'
        },
        {
          n:3,
          label:'Your partner up top - stay connected',
          to:'LW'
        }
      ],
      do:[
        'Move with the box. If the puck slides, you slide - same distance, same time.',
        'Pressure only when the puck is on your side and you can reach it in two strides.',
        'Stick in the shot lane. Blocked shots are the whole job.',
        'Any chance to clear it, take it. Glass and out is a great play.'
      ],
      mistake:'Running at the puck all over the zone. You get tired, the box breaks, and they score through the hole you left.',
      remember:'Move as a unit. Sticks in lanes. Clear it when you can.'
    },
    LW:{
      job:'Other top corner of the box. You mirror your center exactly.',
      look:[
        {
          n:1,
          label:'The puck',
          to:'puck'
        },
        {
          n:2,
          label:'Their point man on your side',
          to:'X1'
        },
        {
          n:3,
          label:'Your center - match him',
          to:'C'
        }
      ],
      do:[
        'Mirror your center. Whatever he does, you do at the same time.',
        'Take away the seam pass to the middle with your stick.',
        'When the puck is not on your side, sag in toward the middle.',
        'Sell out to block shots from your side.'
      ],
      mistake:'Both of you chasing the same puck. Now the whole top of the zone is open.'
    },
    LD:{
      job:'Bottom of the box on your side. The net and the low ice are yours.',
      look:[
        {
          n:1,
          label:'The net-front man',
          to:'X5'
        },
        {
          n:2,
          label:'The puck',
          to:'puck'
        },
        {
          n:3,
          label:'The back door across the crease',
          to:[20,52]
        }
      ],
      do:[
        'Stay tight to the net. The box is small down low, wide up high.',
        'Body on the net-front man, stick in the low passing lane.',
        'Do not chase into the corner. Let them have the corner, never the slot.',
        'Clear rebounds hard, out and away.'
      ],
      mistake:'Leaving the net front to pressure a puck in the corner. That is exactly what they want.'
    },
    RD:{
      job:'Other bottom corner. Take away the low seam and the back door.',
      look:[
        {
          n:1,
          label:'The back door and far post',
          to:'X5'
        },
        {
          n:2,
          label:'The puck',
          to:'puck'
        },
        {
          n:3,
          label:'Your partner - stay tied together',
          to:'LD'
        }
      ],
      do:[
        'Slide with your partner. The two of you protect one net together.',
        'The pass across the low slot is their best play - kill it with your stick.',
        'Block shots with your feet under you so you can recover.',
        'Talk constantly. You are the eyes for the guy watching the puck.'
      ],
      mistake:'Watching the puck and losing the man behind you at the far post.'
    },
    G:{
      job:'See it, stop it, and kill the play dead.',
      look:[
        {
          n:1,
          label:'The puck through the traffic',
          to:'puck'
        },
        {
          n:2,
          label:'The back door',
          to:'X5'
        }
      ],
      do:[
        'Fight for sightlines - move your head, not just your body.',
        'Freeze anything you can. A whistle is a killed penalty.',
        'Talk loud about back-door men.'
      ],
      mistake:'Giving up rebounds into the slot when a freeze was available.'
    }
  },
  phase:'D',
  order:40,
  phases:{
    box:['D','D','D','D','D']
  },
  next:{},
  roles:{
    X1:'point',
    X2:'half wall',
    X3:'half wall',
    X4:'bumper',
    X5:'net front'
  },
  tests:[
    {
      q:'You are killing a penalty. The puck goes to their player on the half wall on your side. Now what?',
      o:[
        'Everybody attacks the puck',
        'The whole box slides that way together',
        'Everybody collapses to the front of the net',
        'Two chase, two stay'
      ],
      a:1,
      why:'The box moves like it is tied together with string. When the box breaks, they score through the hole.'
    },
    {
      q:'The puck comes loose right beside you on the penalty kill. Best play?',
      o:[
        'Stickhandle up the ice and try to score',
        'Pass to a teammate in the middle',
        'Get it out - off the glass and down the ice',
        'Freeze it and wait for a whistle'
      ],
      a:2,
      why:'On a penalty kill, boring is beautiful. Any clear is a good clear.'
    }
  ],
  placeq:[
    {
      pos:'C',
      fr:1,
      ask:'The puck went to the top-side half wall. Where does your corner of the box slide to?'
    },
    {
      pos:'LD',
      fr:0,
      ask:'Put the low D in his corner of the box.'
    }
  ],
  videos:[
    {
      id:'XeNryUEVlI8',
      t:'Hockey Penalty Kill: Simple Box',
      c:'Weiss Tech Hockey',
      w:'"Simple box" is the right first penalty kill at this age.'
    },
    {
      id:'b-FuFHEAsoA',
      t:'Penalty Kill: Box vs. Diamond Formation',
      c:'Rink Tactics',
      w:'Side-by-side of the two shapes he will hear about.'
    },
    {
      id:'CS5rJEhOu8A',
      t:'Diamond PK: Defending the Bumper and Net Front',
      c:'Webb Human Performance',
      w:'For later - how the box changes against a 1-3-1.'
    },
    {
      id:'0Hspvnyt_Nc',
      t:'Aggressive Box-to-Diamond Penalty Kill Rotation',
      c:'Langdon Lamp Lighter Hockey',
      w:'Advanced. Save this one for a couple years from now.'
    }
  ],
  searchq:'hockey penalty kill box',
  keys:{
    base:[
      'penalty kill',
      'pk',
      'short handed',
      'shorthanded',
      'man down',
      'down a man',
      '4 on 5',
      'four on five',
      'kill the penalty',
      'box',
      'penalty killing'
    ],
    v:{
      box:['box','simple box','slide','clear it']
    }
  }
},

/* ---- Breakout (T, order 50) ---- */
{
  id:'breakout',
  name:'Breakout',
  group:'T',
  ages:['10U','12U','14U'],
  about:'We just won it. Now get out of our own end.',
  focus:[-5,-5,116,95],
  roster:['G','LD','RD','C','LW','RW'],
  variants:[
    {
      id:'wall',
      name:'Clean wall breakout',
      note:'The bread-and-butter play. Learn this one cold.',
      frames:[
        {
          t:0,
          cue:'Your D has it behind the net. Everybody get to your spot and give him a target.',
          us:{G:[13.5,42.5], LD:[9,36], RD:[11,52], LW:[30,7], C:[24,40], RW:[46,74]},
          them:{X1:[20,30], X2:[33,18], X3:[43,42], X4:[70,28], X5:[70,56]},
          puck:[
            9,
            36.5,
            'LD'
          ]
        },
        {
          t:0.3,
          cue:'LD comes out with SPEED - he never stops. LW is stopped on the wall at the hash marks with his stick on the ice.',
          us:{LD:[20,25], C:[22,40], LW:[30,8], RW:[58,75]},
          them:{X1:[24,26], X2:[33,16]},
          puck:[
            20,
            25.5,
            'LD'
          ]
        },
        {
          t:0.55,
          cue:'Pass to the wall. C is already moving through the middle - BEHIND the puck, not ahead of it.',
          us:{LD:[30,20], C:[28,40], RW:[72,74]},
          them:{X1:[28,24], X3:[46,42]},
          puck:[30,9]
        },
        {
          t:0.75,
          cue:'LW turns up ice with it. C is the middle option with speed, RW is stretching the far side.',
          us:{LW:[40,11], C:[58,39], LD:[38,22], RW:[82,72]},
          them:{X2:[40,20], X3:[56,44], X1:[34,26]},
          puck:[
            40,
            11.5,
            'LW'
          ]
        },
        {
          t:1,
          cue:'Puck to C in the middle lane at the blue line. Three of us moving forward - that is a breakout.',
          us:{C:[70,38], LW:[56,13], RW:[92,70], LD:[50,24], RD:[38,52]},
          them:{X3:[64,44], X2:[50,18], X4:[84,30], X5:[84,58]},
          puck:[
            70,
            38.5,
            'C'
          ]
        }
      ]
    },
    {
      id:'dtod',
      name:'Under pressure - D to D',
      note:'When the forechecker is right on top of your D.',
      frames:[
        {
          t:0,
          cue:'A forechecker is right on your D and the wall is covered. Do not force it.',
          us:{G:[13.5,42.5], LD:[9,36], RD:[13,52], LW:[30,7], C:[23,42], RW:[46,74]},
          them:{X1:[13,32], X2:[29,12], X3:[40,44], X4:[70,28], X5:[70,56]},
          puck:[
            9,
            36.5,
            'LD'
          ]
        },
        {
          t:0.3,
          cue:'LD goes behind the net and hands it to RD on the other side. Now the forechecker has to skate all the way around.',
          us:{LD:[9,48], RD:[13,56], C:[24,50]},
          them:{X1:[9,40]},
          puck:[11,52]
        },
        {
          t:0.55,
          cue:'RD has time and space. C swings low on the NEW side to be the short option - you follow the puck across.',
          us:{RD:[19,60], LD:[11,44], C:[28,58], RW:[40,76], LW:[40,10]},
          them:{X1:[13,50], X3:[40,52]},
          puck:[
            19,
            60,
            'RD'
          ]
        },
        {
          t:0.8,
          cue:'RD to RW on the wall. Exact same play, just the other side of the ice.',
          us:{RW:[40,77], C:[44,54], RD:[28,62]},
          them:{X3:[46,52], X1:[22,56]},
          puck:[40,77]
        },
        {
          t:1,
          cue:'Out clean. Patience beat pressure - and nobody made a risky pass through the middle.',
          us:{RW:[52,76], C:[60,50], LW:[58,14], RD:[38,62], LD:[24,44]},
          them:{X3:[54,50], X5:[76,60]},
          puck:[
            52,
            76,
            'RW'
          ]
        }
      ]
    }
  ],
  coach:{
    C:{
      job:'Middle-lane support. Be the short option with your feet already moving.',
      look:[
        {
          n:1,
          label:'Your D\'s eyes and the puck',
          to:'puck'
        },
        {
          n:2,
          label:'The middle of the ice - is their F3 sitting there?',
          to:'X3'
        },
        {
          n:3,
          label:'Your far wing for the long stretch pass',
          to:'RW'
        }
      ],
      do:[
        'Swing low first, then curl toward the puck side - you should be MOVING when the pass comes.',
        'Stay behind the puck until you have it. No support means no breakout.',
        'Once you get it, look up the middle first, then the far wing.',
        'If the puck goes D-to-D, you go across too. You follow the puck.'
      ],
      mistake:'Standing still, or floating up high past your own D. Then your D has nobody to pass to and has to throw it away.',
      remember:'Low, then moving, then middle.'
    },
    LD:{
      job:'Retrieve, then move it. You have about two seconds - use them.',
      look:[
        {
          n:1,
          label:'Over your shoulder BEFORE you get the puck',
          to:'X1'
        },
        {
          n:2,
          label:'Your wing on the wall',
          to:'LW'
        },
        {
          n:3,
          label:'Your partner for the D-to-D bail-out',
          to:'RD'
        }
      ],
      do:[
        'Check over your shoulder before you touch it so you already know your play.',
        'Skate out with speed - a moving D is very hard to forecheck.',
        'Wall first, middle second, D-to-D third.',
        'If nothing is there, put it high off the glass. That is a good play, not a bad one.'
      ],
      mistake:'Stopping behind the net with the puck. That is when you get hit and it ends up in our net.'
    },
    RD:{
      job:'Support your partner, then get up ice behind the play.',
      look:[
        {
          n:1,
          label:'Your partner with the puck',
          to:'LD'
        },
        {
          n:2,
          label:'The forechecker coming at him',
          to:'X1'
        },
        {
          n:3,
          label:'The middle of the ice behind you',
          to:[30,42]
        }
      ],
      do:[
        'Be on the other side of the net so D-to-D is always available.',
        'Talk to your partner - tell him "time" or "pressure."',
        'Once the puck is out, follow the play up ice. Do not stay parked.',
        'You are the safety valve. Somebody has to be the last man back.'
      ],
      mistake:'Skating up the ice too early, so when the puck comes back your partner has no help.'
    },
    LW:{
      job:'Be a stationary target on the wall at the hash marks.',
      look:[
        {
          n:1,
          label:'The puck and your D',
          to:'puck'
        },
        {
          n:2,
          label:'Over your inside shoulder for the man on you',
          to:'X2'
        },
        {
          n:3,
          label:'Up ice - where you are going next',
          to:[70,14]
        }
      ],
      do:[
        'Get to the wall at the hash marks and STOP. Face the puck.',
        'Stick flat on the ice, blade toward your D. That is his target.',
        'Take the pass, take one step to the middle, then go up ice.',
        'If you are covered, tell your D and give him a different look.'
      ],
      mistake:'Drifting up the boards so the pass has to be perfect, or skating away from the puck before you have it.'
    },
    RW:{
      job:'Far-side stretch. You are the long option and the one who beats their D up ice.',
      look:[
        {
          n:1,
          label:'The puck across the ice',
          to:'puck'
        },
        {
          n:2,
          label:'Their D - can you get behind him?',
          to:'X5'
        },
        {
          n:3,
          label:'The far wall - your lane',
          to:[92,74]
        }
      ],
      do:[
        'Get wide to your boards near the blue line and time your speed.',
        'Look for the long pass, but do not leave the zone before the puck.',
        'If they pass you the puck, go. If not, stay wide and stretch their D back.',
        'On a D-to-D you become the near wing. Swap jobs with LW.'
      ],
      mistake:'Coming all the way back into the corner. Now all five of us are in one small box and there is nowhere to pass.'
    },
    G:{
      job:'Stop it, then start it. You are the sixth passer.',
      look:[
        {
          n:1,
          label:'The puck',
          to:'puck'
        },
        {
          n:2,
          label:'Your D coming for it',
          to:'LD'
        }
      ],
      do:[
        'Leave the puck where your D is going, not where he is.',
        'Yell what you see: "behind you", "time", "wheel".',
        'Stop the puck on the boards so it does not bounce out to the slot.'
      ],
      mistake:'Freezing pucks that could have been played, or leaving them in the middle of the ice.'
    }
  },
  phase:'T',
  order:50,
  phases:{
    wall:['T','T','T','T','T'],
    dtod:['T','T','T','T','T']
  },
  next:{
    wall:{
      sit:'entry',
      v:'wide',
      label:'We are out and moving. Now attack their blue line.'
    },
    dtod:{
      sit:'entry',
      v:'wide',
      label:'Out clean. Now attack their blue line.'
    }
  },
  roles:{
    X1:'their F1',
    X2:'their F2',
    X3:'their F3',
    X4:'their D',
    X5:'their D'
  },
  tests:[
    {
      q:'Your D has the puck behind our net. You are the centre. Where do you go?',
      o:[
        'Stand at the blue line and wait for a long pass',
        'Swing low, then come back through the middle with your feet moving',
        'Go to the front of our own net',
        'Follow your D behind the net'
      ],
      a:1,
      why:'Your D needs a short option who is already moving. Standing still - or floating too high - forces him to throw it away.'
    },
    {
      q:'You are the wing on the boards for the breakout. What do your feet do?',
      o:[
        'Skate up ice and look back for the pass',
        'Stop at the hash marks, face the puck, stick on the ice',
        'Keep circling so nobody can cover you',
        'Go into the corner to help'
      ],
      a:1,
      why:'Be a target, not a moving target. Stop, face the puck, blade on the ice - then go.'
    },
    {
      q:'A forechecker is right on your D and the wall is covered. Right play?',
      o:[
        'Force it up the boards anyway',
        'D-to-D behind the net and start again',
        'Throw it up the middle and hope',
        'Blast it off the glass blind'
      ],
      a:1,
      why:'D-to-D makes the forechecker skate all the way around. Patience beats pressure.'
    }
  ],
  placeq:[
    {
      pos:'LW',
      fr:0,
      ask:'Your D has it behind the net. Where does the strong-side wing wait?'
    },
    {
      pos:'C',
      fr:1,
      ask:'Put the centre in his breakout support spot.'
    }
  ],
  videos:[
    {
      id:'-5RhWjixABU',
      t:'Hockey 101: Defensive Zone Breakouts',
      c:'Off the Wall Hockey',
      w:'The whole shape in one video, including wingers on the walls.'
    },
    {
      id:'91349oj2Q6U',
      t:'Breakout Options: D-to-D, Strong-Side Winger, Centre Pass',
      c:'Coach K',
      w:'The three options animated above, explained on video.'
    },
    {
      id:'_nimsPFq0IQ',
      t:'Strong-Side Breakout Fundamentals',
      c:'HockeyShare',
      w:'Wall breakout mechanics - drillable at practice as-is.'
    }
  ],
  searchq:'hockey defensive zone breakout',
  keys:{
    base:[
      'breakout',
      'break out',
      'get out of our zone',
      'retrieval',
      'outlet',
      'wheel',
      'hash marks',
      'exit',
      'leaving our zone',
      'first pass'
    ],
    v:{
      wall:['wall','strong side','hash','clean','winger on the wall'],
      dtod:[
        'd to d',
        'd-to-d',
        'dtod',
        'under pressure',
        'reverse',
        'behind the net',
        'pressured'
      ]
    }
  }
},

/* ---- Regroup (T, order 60) ---- */
{
  id:'regroup',
  name:'Regroup',
  phase:'T',
  ages:['12U','14U','16U','18U'],
  about:'The play died. Reset and come again with speed.',
  focus:[46,-5,112,95],
  roster:['C','LW','RW','LD','RD'],
  coach:{
    C:{
      job:'Own the middle lane - going forward AND coming back.',
      look:[
        {
          n:1,
          label:'The puck',
          to:'puck'
        },
        {
          n:2,
          label:'The middle lane in front of and behind you',
          to:[100,42]
        },
        {
          n:3,
          label:'Your wings - are they wide?',
          to:'LW'
        }
      ],
      do:[
        'Going forward: stay in the middle, behind the puck, moving.',
        'Coming back: skate to the inside hip of the puck carrier and stay with him.',
        'Never leave the middle lane to go help on the wall. Your winger has that.',
        'On a regroup, swing low and come back with speed instead of standing at the line.'
      ],
      mistake:'Drifting to the boards where your winger already is. Now two of you are in one lane and the middle is empty.',
      remember:'You live in the middle. Both directions.'
    },
    LW:{
      job:'Get wide, stay onside, and time your speed to the puck.',
      look:[
        {
          n:1,
          label:'The puck',
          to:'puck'
        },
        {
          n:2,
          label:'The blue line',
          to:[125,12]
        },
        {
          n:3,
          label:'The man who has to cover you',
          to:'X2'
        }
      ],
      do:[
        'Wide means WIDE - within a couple feet of the boards.',
        'Time your speed so you cross the line as the puck does.',
        'Coming back, pick up their winger on your side. Stay above him.',
        'Being wide stretches their team out. That alone creates room.'
      ],
      mistake:'Curling into the middle so all three forwards end up in one clump.'
    },
    RW:{
      job:'Same as LW on the other side. Wide, onside, and above your man.',
      look:[
        {
          n:1,
          label:'The puck',
          to:'puck'
        },
        {
          n:2,
          label:'Your lane along the boards',
          to:[122,72]
        },
        {
          n:3,
          label:'Their winger on your side',
          to:'X3'
        }
      ],
      do:[
        'Stretch their D by getting behind them when you can.',
        'On the way back, your man is the winger on your side. Find him early.',
        'Do not cross into the middle - that is your center\'s ice.',
        'Stay onside. A great rush killed by offside is nothing.'
      ],
      mistake:'Watching the puck instead of your man on the way back, so their winger gets in free.'
    },
    LD:{
      job:'Move the puck on the regroup, and control the gap on the way back.',
      look:[
        {
          n:1,
          label:'Your partner for D-to-D',
          to:'RD'
        },
        {
          n:2,
          label:'The wide wings',
          to:'LW'
        },
        {
          n:3,
          label:'The middle for your center',
          to:'C'
        }
      ],
      do:[
        'D-to-D first if the middle is clogged. Making them shift is the point.',
        'Coming back, keep a tight gap - close enough to touch him with your stick.',
        'Skate backward with your partner, side by side, same speed.',
        'Angle him toward the boards. The middle is where they score from.'
      ],
      mistake:'Backing in all the way to the goal line. You gave them the whole zone for free.'
    },
    RD:{
      job:'Stay connected to your partner. Two D moving as one unit.',
      look:[
        {
          n:1,
          label:'Your partner',
          to:'LD'
        },
        {
          n:2,
          label:'The puck carrier',
          to:'puck'
        },
        {
          n:3,
          label:'The far side in case it goes across',
          to:[110,66]
        }
      ],
      do:[
        'Mirror your partner. Same depth, same speed, a stick apart is too close.',
        'Talk: "I got him", "switch", "step up".',
        'Step up at the line when you can - killing the play there is worth a lot.',
        'On the regroup, be a real option, not a place to hide the puck.'
      ],
      mistake:'Two D at completely different depths, so there is a huge hole to pass through between you.'
    }
  },
  variants:[
    {
      id:'regroup',
      name:'Bring it back and reset',
      note:'Better than dumping it in and hoping.',
      frames:[
        {
          t:0,
          cue:'The play died at their blue line. Bring it back, reset, and come again with speed.',
          us:{LD:[70,32], RD:[70,54], LW:[86,10], C:[78,42], RW:[86,74]},
          them:{X1:[86,44], X2:[100,22], X3:[100,64], X4:[114,34], X5:[114,54]},
          puck:[
            70,
            32.5,
            'LD'
          ]
        },
        {
          t:0.3,
          cue:'D-to-D behind the line. Wings get WIDE to the boards. C stays in the middle, behind the puck.',
          us:{LD:[66,36], RD:[68,50], LW:[88,8], RW:[88,76], C:[62,44]},
          them:{X1:[82,42]},
          puck:[
            68,
            49,
            'RD'
          ]
        },
        {
          t:0.58,
          cue:'Wings time it so they hit the line MOVING, not standing. C swings and turns up the middle lane.',
          us:{RD:[74,54], LD:[66,40], LW:[96,8], RW:[96,76], C:[84,44]},
          them:{X1:[86,48], X2:[102,20], X3:[102,66]},
          puck:[
            74,
            54.5,
            'RD'
          ]
        },
        {
          t:0.82,
          cue:'RD hits C in the middle - against a trap, the softest ice is right up the gut.',
          us:{C:[94,44], RD:[80,54], LW:[106,10], RW:[106,74]},
          them:{X2:[104,22], X3:[104,64], X4:[116,36]},
          puck:[
            94,
            44.5,
            'C'
          ]
        },
        {
          t:1,
          cue:'Three lanes filled, everyone moving forward. That is how you attack instead of throwing it away.',
          us:{C:[112,44], LW:[122,12], RW:[122,72], LD:[96,36], RD:[92,52]},
          them:{X4:[122,38], X5:[124,56]},
          puck:[
            112,
            44.5,
            'C'
          ]
        }
      ]
    }
  ],
  order:60,
  group:'T',
  phases:{
    regroup:['T','T','T','T','T']
  },
  next:{
    regroup:{
      sit:'entry',
      v:'wide',
      label:'Three lanes, full speed. Now attack their blue line.'
    }
  },
  roles:{
    X1:'their F1',
    X2:'their F2',
    X3:'their F2',
    X4:'their D',
    X5:'their D'
  },
  tests:[
    {
      q:'The play died at their blue line but we still have the puck. Smart play?',
      o:[
        'Dump it in and chase',
        'Bring it back, reset, and come again with speed',
        'Everybody stop and wait for a whistle',
        'Try to beat all five of them yourself'
      ],
      a:1,
      why:'A regroup turns a dead play into a fresh rush. Wings wide, centre in the middle, and come again.'
    },
    {
      q:'On a regroup, where do the wings go?',
      o:[
        'Into the middle next to the centre',
        'Wide, almost on the boards',
        'Back to help the D',
        'To the front of their net'
      ],
      a:1,
      why:'Wide wings stretch their team out and open the middle. Three players in three different lanes.'
    }
  ],
  placeq:[
    {
      pos:'LW',
      fr:1,
      ask:'We are regrouping. Where does the wing go?'
    },
    {
      pos:'C',
      fr:2,
      ask:'Put the centre in his lane on the regroup.'
    }
  ],
  videos:[
    {
      id:'FrdwCJ6c2LM',
      t:'Understanding Neutral Zone Regroups',
      c:'PowerTech Hockey',
      w:'Why you bring it back instead of dumping it in.'
    },
    {
      id:'0A0clGq1FZs',
      t:'Neutral Zone Regroup - D-to-D Drill',
      c:'Sean Johnson',
      w:'An actual drill you can ask his coach to run.'
    }
  ],
  searchq:'hockey neutral zone regroup',
  keys:{
    base:[
      'regroup',
      're group',
      'reset',
      'come again',
      'swing',
      'stretch',
      'neutral zone offence',
      'neutral zone offense',
      'turn back',
      'back it up'
    ],
    v:{
      regroup:['regroup','reset','d to d','wide wings']
    }
  }
},

/* ---- Staying onside (T, order 70) ---- */
{
  id:'offside',
  name:'Staying onside',
  group:'T',
  ages:['8U','10U','12U'],
  about:'The puck goes in first, then you do.',
  focus:[80,-5,122,95],
  roster:['C','LW','RW','LD','RD'],
  variants:[
    {
      id:'onside',
      name:'Puck goes in first',
      note:'One rule, and it decides whether your rush lives.',
      frames:[
        {
          t:0,
          cue:'C is coming up the middle with the puck. That blue line is a gate - the puck opens it.',
          us:{C:[104,42], LW:[110,16], RW:[108,66], LD:[86,32], RD:[84,54]},
          them:{XG:[187,42.5], X1:[132,40], X2:[140,22], X3:[140,60], X4:[124,32], X5:[124,54]},
          puck:[
            104,
            42.5,
            'C'
          ]
        },
        {
          t:0.36,
          cue:'LW gets to the line and WAITS. His skates stay on this side until the puck is in.',
          us:{C:[114,42], LW:[123,16], RW:[120,64], LD:[96,32]},
          them:{X1:[134,40], X4:[126,30]},
          puck:[
            114,
            42.5,
            'C'
          ]
        },
        {
          t:0.7,
          cue:'Now C carries the puck over the line first. The gate is open.',
          us:{C:[130,42], LW:[132,16], RW:[130,64], LD:[110,32]},
          them:{X1:[136,42], X4:[130,28]},
          puck:[
            130,
            42.5,
            'C'
          ]
        },
        {
          t:1,
          cue:'Everybody in, nobody offside, and we still have the puck.',
          us:{C:[146,40], LW:[152,16], RW:[150,64], LD:[124,34], RD:[120,54]},
          them:{X1:[148,44], X2:[158,24], X4:[140,30]},
          puck:[
            146,
            40.5,
            'C'
          ]
        }
      ]
    },
    {
      id:'early',
      name:'Too early - whistle',
      wrong:true,
      note:'The most common whistle in youth hockey, and the easiest to fix.',
      frames:[
        {
          t:0,
          cue:'Same rush. Watch left wing this time.',
          us:{C:[104,42], LW:[110,16], RW:[108,66], LD:[86,32], RD:[84,54]},
          them:{XG:[187,42.5], X1:[132,40], X2:[140,22], X3:[140,60], X4:[124,32], X5:[124,54]},
          puck:[
            104,
            42.5,
            'C'
          ]
        },
        {
          t:0.4,
          cue:'LW crosses the blue line before the puck. That is offside the second his skate lands.',
          us:{C:[112,42], LW:[132,16], RW:[118,64], LD:[94,32]},
          them:{X1:[134,40], X4:[126,30]},
          puck:[
            112,
            42.5,
            'C'
          ]
        },
        {
          t:0.72,
          cue:'Whistle. The play is dead and they get the puck back outside the zone.',
          us:{C:[118,42], LW:[134,16], RW:[122,64], LD:[98,32]},
          them:{X1:[130,40], X4:[126,30]},
          puck:[
            118,
            42.5,
            'C'
          ]
        },
        {
          t:1,
          cue:'All that speed for nothing. Wait half a second for the puck and that rush is still alive.',
          us:{C:[100,42.5], LW:[92,22], RW:[92,63], LD:[80,34], RD:[80,52]},
          them:{X1:[101.5,42.5], X2:[108,22], X3:[108,63], X4:[120,34], X5:[120,52]},
          puck:[
            100,
            42.5,
            null
          ]
        }
      ]
    }
  ],
  coach:{
    C:{
      job:'You have the puck, so you decide when the gate opens. Carry it in.',
      look:[
        {
          n:1,
          label:'The blue line in front of you',
          to:[125,42]
        },
        {
          n:2,
          label:'Your wings - are they waiting?',
          to:'LW'
        },
        {
          n:3,
          label:'Their D backing up',
          to:'X4'
        }
      ],
      do:[
        'Carry the puck over the line yourself if nobody is open.',
        'If a wing is flying, put the puck in FRONT of him before he crosses.',
        'Never pass it to a man who is already over the line.',
        'Slow down a half step rather than throwing it away.'
      ],
      mistake:'Passing to a wing who has already crossed. That is offside, and it was your pass that did it.'
    },
    LW:{
      job:'Get to the line with speed, then wait for the puck to go first.',
      look:[
        {
          n:1,
          label:'The puck',
          to:'puck'
        },
        {
          n:2,
          label:'The blue line under your feet',
          to:[125,16]
        }
      ],
      do:[
        'Time it so you hit the line MOVING, not standing still.',
        'Keep your skates on your side of the line until the puck is in.',
        'One stride late is fine. One stride early is a whistle.',
        'If you drift over, come all the way back out and go again.'
      ],
      mistake:'Watching the puck and forgetting your feet. Your skates are what the linesman is watching.'
    },
    RW:{
      job:'Same rule on your side. Wide, fast, and onside.',
      look:[
        {
          n:1,
          label:'The puck',
          to:'puck'
        },
        {
          n:2,
          label:'The blue line under your feet',
          to:[125,66]
        }
      ],
      do:[
        'Stay wide so the pass has somewhere to go.',
        'Let the puck cross before you do.',
        'If the play gets stopped, get back out and start again.'
      ],
      mistake:'Cutting to the middle early, so you are both offside and in your centre\'s way.'
    },
    LD:{
      job:'Follow the rush up, but stay behind it.',
      look:[
        {
          n:1,
          label:'The puck',
          to:'puck'
        },
        {
          n:2,
          label:'The middle of the ice behind you',
          to:[100,42]
        }
      ],
      do:[
        'Come up to the line as the puck goes in, not before.',
        'You are the one who keeps the puck in the zone later - be at the line, not past it.'
      ],
      mistake:'Jumping ahead of the puck. Now you are offside and there is nobody home.'
    },
    RD:{
      job:'Last man back. Support the rush and be ready if it dies.',
      look:[
        {
          n:1,
          label:'The puck',
          to:'puck'
        },
        {
          n:2,
          label:'Their fastest man',
          to:'X5'
        }
      ],
      do:[
        'Stay a little behind your partner.',
        'If the whistle goes, be first back for the faceoff.'
      ],
      mistake:'Chasing the play in and getting caught when the puck comes straight back out.'
    }
  },
  phase:'T',
  order:70,
  phases:{
    onside:['T','T','O','O'],
    early:['T','T','T','T']
  },
  next:{
    onside:{
      sit:'ozone',
      v:'cycle',
      label:'We got in clean with the puck. Now go to work in their end.'
    },
    early:{
      sit:'faceoff',
      v:'ozone',
      label:'Offside means a faceoff. Let us win it back.'
    }
  },
  roles:{
    X1:'their D',
    X2:'their wing',
    X3:'their wing',
    X4:'their D',
    X5:'back-checker',
    XG:'goalie'
  },
  tests:[
    {
      q:'You are flying up the wing and the blue line is right there. The puck is still behind you. What do you do?',
      o:[
        'Cross and wait for it',
        'Slow down and let the puck go in first',
        'Yell for the pass',
        'Cut to the middle'
      ],
      a:1,
      why:'The puck has to cross the line before you do. Half a second of patience keeps the whole rush alive.'
    },
    {
      q:'You have the puck at the blue line and your wing has already crossed it. What is your play?',
      o:['Pass it to him','Carry it in yourself','Shoot it in','Pass it back'],
      a:1,
      why:'Passing to a man who is already over the line is offside, and it was your pass that caused it. Carry it in instead.'
    },
    {
      q:'The whistle goes for offside on your rush. What did it cost you?',
      o:[
        'Nothing, we get it back',
        'A faceoff outside their zone',
        'A penalty',
        'A goal against'
      ],
      a:1,
      why:'You hand them the puck outside the zone and all that speed is gone. That is why the rule is worth learning early.'
    }
  ],
  placeq:[
    {
      pos:'LW',
      fr:1,
      v:'onside',
      ask:'The puck is still coming up the middle. Drag YOU to where the left wing waits.'
    },
    {
      pos:'C',
      fr:2,
      v:'onside',
      ask:'You have the puck at the line. Put the centre where he takes it in.'
    }
  ],
  keys:{
    base:[
      'offside',
      'off side',
      'off-side',
      'blue line',
      'blueline',
      'onside',
      'on side',
      'stay onside',
      'linesman',
      'whistle',
      'too early',
      'early',
      'the line',
      'entering the zone',
      'gate'
    ],
    v:{
      onside:['onside','on side','puck first','clean','right way','wait','patient'],
      early:['early','too early','offside','whistle','blown','mistake','wrong way']
    }
  },
  videos:[
    {
      id:'LjF2rB1VuH4',
      t:'Hockey, Explained: Zone Entries - Wide Drive',
      c:'BCHockey_Source',
      w:'This is the wide-with-speed variant, on video.'
    },
    {
      id:'DPPwhH29V_c',
      t:'Hockey, Explained: Zone Entries - Wide Entry Low Delay',
      c:'BCHockey_Source',
      w:'The delay. The most under-taught play in youth hockey.'
    }
  ],
  searchq:'hockey offside blue line rule for kids'
},

/* ---- Zone entry (T, order 80) ---- */
{
  id:'entry',
  name:'Zone entry',
  group:'T',
  ages:['12U','14U','16U'],
  about:'Crossing their blue line with the puck.',
  focus:[80,-5,122,95],
  roster:['C','LW','RW','LD','RD'],
  variants:[
    {
      id:'wide',
      name:'Wide with speed, drive the net',
      note:'One guy wide, one guy to the net, one guy late in the middle.',
      frames:[
        {
          t:0,
          cue:'We are crossing center with the puck. Now spacing is everything - wide, wide, and one in the middle.',
          us:{LW:[112,12], C:[104,38], RW:[110,66], LD:[98,30], RD:[94,54]},
          them:{X1:[118,44], X2:[140,28], X3:[140,58], X4:[128,16], X5:[128,70]},
          puck:[
            112,
            12.5,
            'LW'
          ]
        },
        {
          t:0.32,
          cue:'LW takes it wide and gains the line. RW drives HARD to the net - that pushes their D backward and opens the middle.',
          us:{LW:[132,9], RW:[132,60], C:[116,38], LD:[108,30]},
          them:{X2:[142,26], X3:[146,56], X1:[124,44]},
          puck:[
            132,
            9.5,
            'LW'
          ]
        },
        {
          t:0.6,
          cue:'C is late ON PURPOSE. You arrive in the slot as the trailer, right where their D just backed out of.',
          us:{C:[136,36], LW:[146,10], RW:[160,52]},
          them:{X2:[150,22], X3:[158,52], X1:[134,44]},
          puck:[
            146,
            10.5,
            'LW'
          ]
        },
        {
          t:0.85,
          cue:'Puck to the slot. Shoot it - you are inside the dots with your feet moving. That is the best shot in hockey.',
          us:{C:[148,36], LW:[156,14], RW:[172,48]},
          them:{X2:[156,24], X3:[166,50], X1:[142,42]},
          puck:[
            148,
            36.5,
            'C'
          ]
        },
        {
          t:1,
          cue:'Shot, and LW and RW both go straight to the net for the second chance.',
          us:{C:[152,38], LW:[170,44], RW:[180,48], LD:[132,32], RD:[118,54]},
          puck:[176,44]
        }
      ]
    },
    {
      id:'delay',
      name:'Delay - nobody is with you yet',
      note:'The most under-taught play in youth hockey.',
      frames:[
        {
          t:0,
          cue:'You have the puck and you are all alone. Skating into three guys is a turnover. Delay instead.',
          us:{C:[114,42], LW:[104,14], RW:[100,64], LD:[92,32], RD:[88,54]},
          them:{X1:[126,42], X2:[140,30], X3:[140,56], X4:[120,20], X5:[120,66]},
          puck:[
            114,
            42.5,
            'C'
          ]
        },
        {
          t:0.35,
          cue:'C curls BACK toward his own end instead of forcing it. That buys two seconds - and two seconds is your whole team.',
          us:{C:[106,34], LW:[116,12], RW:[112,66], LD:[104,34]},
          them:{X1:[124,34], X2:[140,28]},
          puck:[
            106,
            34.5,
            'C'
          ]
        },
        {
          t:0.62,
          cue:'Now LW is beside you with speed. Hand it off and go to the net yourself.',
          us:{C:[118,20], LW:[126,12], RW:[124,64], LD:[112,34]},
          them:{X1:[122,30], X2:[142,26]},
          puck:[
            126,
            12.5,
            'LW'
          ]
        },
        {
          t:1,
          cue:'Clean entry, three players in with speed. Same rush, ten times better - just because you waited.',
          us:{LW:[146,12], C:[140,34], RW:[148,58], LD:[122,32], RD:[112,54]},
          them:{X2:[152,22], X3:[154,54], X1:[134,40]},
          puck:[
            146,
            12.5,
            'LW'
          ]
        }
      ]
    }
  ],
  coach:{
    C:{
      job:'Middle lane. You are the late man - the trailer who arrives in the slot.',
      look:[
        {
          n:1,
          label:'The puck carrier on the wall',
          to:'puck'
        },
        {
          n:2,
          label:'The slot - the ice between the circles',
          to:[150,38]
        },
        {
          n:3,
          label:'Their D - is he backing off?',
          to:'X2'
        }
      ],
      do:[
        'Stay in the middle lane. Your wings own the boards; do not go there.',
        'Enter the zone a beat LATE and with speed. Early means covered.',
        'If you have it and you are alone, delay - curl back and wait for help.',
        'When you get it in the slot, shoot. Do not look for one more pass.'
      ],
      mistake:'Racing into the zone first and standing still, or drifting onto the same wall as your winger so two of you are in one lane.',
      remember:'Middle lane. Arrive late. Arrive fast.'
    },
    LW:{
      job:'Carry or attack wide. Gain the line, then make a play from the outside.',
      look:[
        {
          n:1,
          label:'The blue line - do not go offside',
          to:[125,12]
        },
        {
          n:2,
          label:'Their D and how much room he gives you',
          to:'X2'
        },
        {
          n:3,
          label:'The slot for the trailer',
          to:'C'
        }
      ],
      do:[
        'Gain the line WIDE with speed so their D has to respect the outside.',
        'Once you are in, look back to the slot before you look at the net.',
        'If you are covered, put it deep behind their D and go get it.',
        'Do not carry it into two guys at the line. That is their best chance to score.'
      ],
      mistake:'Cutting to the middle right at the blue line, straight into their D and their center.'
    },
    RW:{
      job:'Drive the far side and go to the net whether you get the puck or not.',
      look:[
        {
          n:1,
          label:'The net',
          to:'theirNet'
        },
        {
          n:2,
          label:'Their D - can you get behind him?',
          to:'X3'
        },
        {
          n:3,
          label:'The puck carrier',
          to:'puck'
        }
      ],
      do:[
        'Drive HARD to the net every time. That is what makes room for everyone else.',
        'Get to the far post, not the middle of the crease.',
        'You are not decoration - you are the tip and the rebound.',
        'Stay a step behind the puck so you are never offside.'
      ],
      mistake:'Slowing down at the top of the circle. Their D relaxes and now the whole rush has no threat.'
    },
    LD:{
      job:'Support the rush from behind. Be the late option and the first man back.',
      look:[
        {
          n:1,
          label:'The puck',
          to:'puck'
        },
        {
          n:2,
          label:'Open ice at the top of the zone',
          to:[132,26]
        },
        {
          n:3,
          label:'Behind you - who is left?',
          to:'RD'
        }
      ],
      do:[
        'Follow the play up to the blue line, not past it, unless it is clearly safe.',
        'Be a real option for a drop pass or a puck back to the point.',
        'The moment the puck turns over, turn and skate. Do not watch it.',
        'Talk to your partner: one of you goes, one of you stays.'
      ],
      mistake:'Joining the rush as a fourth attacker with nobody covering behind you.'
    },
    RD:{
      job:'The safety. Nothing gets behind you, ever.',
      look:[
        {
          n:1,
          label:'Their fastest forward',
          to:'X1'
        },
        {
          n:2,
          label:'The puck',
          to:'puck'
        },
        {
          n:3,
          label:'The middle of the neutral zone',
          to:[110,42]
        }
      ],
      do:[
        'Stay higher than your partner and in the middle of the ice.',
        'Keep your feet moving so you can turn instantly.',
        'You are allowed to be boring. Boring D win games.',
        'If the puck is lost, you are already going the other way.'
      ],
      mistake:'Both D above the puck at the same depth. One turnover and it is an odd-man rush.'
    }
  },
  phase:'T',
  order:80,
  phases:{
    wide:['T','O','O','O','O'],
    delay:['T','T','O','O']
  },
  next:{
    wide:{
      sit:'ozone',
      v:'cycle',
      label:'We are in with the puck. Now keep it and work it low.'
    },
    delay:{
      sit:'ozone',
      v:'cycle',
      label:'Clean entry with three players. Now keep it.'
    }
  },
  roles:{
    X1:'back-checker',
    X2:'their D',
    X3:'their D',
    X4:'their wing',
    X5:'their wing'
  },
  tests:[
    {
      q:'You have the puck at their blue line and nobody has caught up to you yet. What do you do?',
      o:[
        'Skate straight into their two D',
        'Delay - curl back and buy two seconds for help',
        'Shoot it from the blue line',
        'Pass it back to our goalie'
      ],
      a:1,
      why:'Two seconds of patience buys you your whole team. Skating into traffic alone is a turnover and a rush against.'
    },
    {
      q:'Your winger is carrying it wide into the zone. You are the centre. When should you arrive in the middle?',
      o:[
        'First, so you are ready',
        'At the exact same time',
        'A beat late, with speed',
        'Not at all - hold the blue line'
      ],
      a:2,
      why:'Arriving early means arriving covered. The trailer who comes late into the slot is the hardest player to defend.'
    },
    {
      q:'You are the far-side wing on a rush and you know you are not getting the puck. What do you do?',
      o:[
        'Ease up at the top of the circle',
        'Drive hard to the net anyway',
        'Stop at the blue line',
        'Cut over to the puck side'
      ],
      a:1,
      why:'Your drive pushes their D backward and opens the middle for everybody else. No drive, no threat.'
    }
  ],
  placeq:[
    {
      pos:'C',
      fr:2,
      ask:'Your winger is wide with the puck. Where is the centre as the trailer?'
    },
    {
      pos:'RW',
      fr:1,
      ask:'Where is the far-side wing on this rush?'
    }
  ],
  videos:[
    {
      id:'LjF2rB1VuH4',
      t:'Hockey, Explained: Zone Entries - Wide Drive',
      c:'BCHockey_Source',
      w:'This is the wide-with-speed variant, on video.'
    },
    {
      id:'DPPwhH29V_c',
      t:'Hockey, Explained: Zone Entries - Wide Entry Low Delay',
      c:'BCHockey_Source',
      w:'The delay. The most under-taught play in youth hockey.'
    },
    {
      id:'8sxlQ50f1R4',
      t:'Hockey, Explained: Zone Entries - High Delay',
      c:'BCHockey_Source',
      w:'The high version of the same idea.'
    }
  ],
  searchq:'hockey offensive zone entry',
  keys:{
    base:[
      'zone entry',
      'entry',
      'entries',
      'carry it in',
      'blue line',
      'gain the line',
      'rush',
      'attack the line',
      'offensive zone entry',
      'crossing the line'
    ],
    v:{
      wide:['wide','wide drive','drive the net','speed','outside','trailer','slot'],
      delay:[
        'delay',
        'curl',
        'curl back',
        'hold up',
        'wait for help',
        'swing back',
        'high delay',
        'low delay'
      ]
    }
  }
},

/* ---- Faceoffs (T, order 90) ---- */
{
  id:'faceoff',
  name:'Faceoffs',
  group:'T',
  ages:['8U','10U','12U'],
  about:'The puck belongs to nobody yet.',
  focus:[-5,-5,96,95],
  roster:['G','LD','RD','C','LW','RW'],
  variants:[
    {
      id:'dzone',
      name:'Defensive zone draw',
      note:'Know your man BEFORE the puck drops.',
      frames:[
        {
          t:0,
          cue:'D-zone draw on the top-side dot. Before the puck drops: know your man, and know where you go if we lose it.',
          us:{G:[13.5,42.5], C:[29.5,20.5], LD:[23,11], RD:[19,35], LW:[38,12], RW:[36,30]},
          them:{X1:[32.5,20.5], X2:[41,10], X3:[40,31], X4:[60,20], X5:[52,42]},
          puck:[31,20.5]
        },
        {
          t:0.3,
          cue:'C wins it back to the corner with a quick pull. Simple beats fancy every single time.',
          us:{C:[30,22], LD:[22,13]},
          puck:[22,12]
        },
        {
          t:0.6,
          cue:'LD picks it up, LW seals his man on the wall, and the breakout is already on.',
          us:{LD:[20,14], LW:[38,10], C:[28,28], RD:[18,38], RW:[38,34]},
          them:{X2:[42,10], X1:[34,22]},
          puck:[
            20,
            14.5,
            'LD'
          ]
        },
        {
          t:1,
          cue:'Out of the zone straight off the draw. Faceoffs are free offense when everybody knows their spot.',
          us:{LD:[28,16], LW:[44,10], C:[40,32], RW:[46,44], RD:[24,44]},
          them:{X2:[46,12], X1:[40,24], X3:[46,36]},
          puck:[
            28,
            16.5,
            'LD'
          ]
        }
      ]
    },
    {
      id:'ozone',
      name:'Offensive zone draw',
      focus:[117,-5,90,95],
      note:'Win it back to the point and shoot before they set up.',
      frames:[
        {
          t:0,
          cue:'O-zone draw. The plan is simple: win it back to the point and get a shot before they can set up.',
          us:{C:[167.5,20.5], LW:[176,11], RW:[174,31], LD:[157,14], RD:[152,34], G:[13.5,42.5]},
          them:{XG:[187,42.5], X1:[170.5,20.5], X2:[161,12], X3:[162,30], X4:[180,14], X5:[180,34]},
          puck:[169,20.5]
        },
        {
          t:0.3,
          cue:'C wins it back to LD at the top of the circle. One clean pull, that is all it takes.',
          us:{C:[168,22], LD:[157,15]},
          puck:[157,15]
        },
        {
          t:0.6,
          cue:'One-touch shot. C goes STRAIGHT to the net - do not stand and admire your own faceoff win.',
          us:{LD:[158,16], C:[178,34], LW:[180,14], RW:[182,44]},
          them:{X2:[162,14], X1:[172,24]},
          puck:[176,38]
        },
        {
          t:1,
          cue:'Traffic and a rebound in the paint. That is how faceoff wins turn into goals.',
          us:{C:[182,40], LW:[183,30], RW:[184,48], LD:[150,20], RD:[148,40]},
          them:{X1:[178,28], X4:[181,36]},
          puck:[184,42]
        }
      ]
    }
  ],
  coach:{
    C:{
      job:'Win the draw, or at least make sure they do not win it clean.',
      look:[
        {
          n:1,
          label:'The linesman\'s hand and the puck',
          to:'puck'
        },
        {
          n:2,
          label:'The other center\'s stick - which hand is he?',
          to:'X1'
        },
        {
          n:3,
          label:'Your D - where are you sending it?',
          to:'LD'
        }
      ],
      do:[
        'Decide your play BEFORE you bend down. Back to the corner is the safe one.',
        'Get low, hands apart on the stick, feet wide.',
        'If you cannot win it, tie up his stick so nobody wins it.',
        'The instant it is won: in our zone, get to the middle. In their zone, go to the net.'
      ],
      mistake:'Standing up and watching after the draw. The two seconds right after a faceoff is when most goals off a draw happen.',
      remember:'Know your play before you bend down.'
    },
    LW:{
      job:'Boards side. Your man is the winger across from you - beat him to the puck.',
      look:[
        {
          n:1,
          label:'Your man across the circle',
          to:'X2'
        },
        {
          n:2,
          label:'The puck',
          to:'puck'
        },
        {
          n:3,
          label:'The wall behind you',
          to:[38,6]
        }
      ],
      do:[
        'Get your stick and body on your man immediately - do not watch the puck drop.',
        'In our zone: seal him off the wall so he cannot get to the corner.',
        'In their zone: go to the net or the wall depending on where it goes.',
        'Loose puck on the wall is yours. Win it and the draw does not even matter.'
      ],
      mistake:'Watching the puck instead of your man, so he beats you to a loose puck you should have had.'
    },
    RW:{
      job:'Inside man. Protect the middle of the ice above the dot.',
      look:[
        {
          n:1,
          label:'Your man on the inside',
          to:'X3'
        },
        {
          n:2,
          label:'The puck',
          to:'puck'
        },
        {
          n:3,
          label:'The middle of the ice behind you',
          to:[30,42]
        }
      ],
      do:[
        'Take away the middle first. That is the dangerous ice.',
        'Stay above the dot in our zone - nothing gets behind you.',
        'If your center loses it back, you are the first layer of coverage.',
        'In their zone, get to the net for the tip.'
      ],
      mistake:'Drifting toward the boards where your winger already is, leaving the middle open off the draw.'
    },
    LD:{
      job:'Boards side of the dot. Be ready for the puck your center pulls back.',
      look:[
        {
          n:1,
          label:'The puck',
          to:'puck'
        },
        {
          n:2,
          label:'Their winger on your side',
          to:'X2'
        },
        {
          n:3,
          label:'Your breakout target on the wall',
          to:'LW'
        }
      ],
      do:[
        'Set up where your center is actually going to put it - talk about it first.',
        'Get there with your feet moving so you are not a sitting target.',
        'Know your first pass before you touch it.',
        'If they win it, get to the net or the corner - whichever is your job.'
      ],
      mistake:'Standing flat-footed and getting beaten to your own center\'s pull-back.'
    },
    RD:{
      job:'Net side. You are the insurance if the draw goes wrong.',
      look:[
        {
          n:1,
          label:'The net-front area',
          to:'ourNet'
        },
        {
          n:2,
          label:'The puck',
          to:'puck'
        },
        {
          n:3,
          label:'Their high man',
          to:'X5'
        }
      ],
      do:[
        'Start in front of the net, not out at the dot.',
        'If they win it clean, you already have the most dangerous ice covered.',
        'Talk to your goalie about who is where.',
        'Once we have it, get to your breakout spot fast.'
      ],
      mistake:'Creeping out toward the circle for offense and leaving the front of your own net empty.'
    },
    G:{
      job:'Be set before the puck drops.',
      look:[
        {
          n:1,
          label:'The puck',
          to:'puck'
        },
        {
          n:2,
          label:'The high man for a quick shot',
          to:'X5'
        }
      ],
      do:[
        'Set your feet and be square to the dot before the drop.',
        'Call out who is uncovered.',
        'Expect a shot right off the draw.'
      ],
      mistake:'Still shuffling into position when the puck drops.'
    }
  },
  phase:'T',
  order:90,
  phases:{
    dzone:['T','T','T','T'],
    ozone:['T','O','O','O']
  },
  next:{
    dzone:{
      sit:'breakout',
      v:'wall',
      label:'We won the draw back. Now break out.'
    },
    ozone:{
      sit:'ozone',
      v:'cycle',
      label:'We won the draw in their end. Now go to work.'
    }
  },
  roles:{
    X1:'their centre',
    X2:'their wing',
    X3:'their wing',
    X4:'their D',
    X5:'their D',
    XG:'goalie'
  },
  tests:[
    {
      q:'Faceoff in our own end. When do you decide what you are doing with the puck?',
      o:[
        'After you see where it goes',
        'Before you bend down for the draw',
        'When your coach yells',
        'You do not need a plan'
      ],
      a:1,
      why:'Know your play before the puck drops. The two seconds right after a draw is when most faceoff goals happen.'
    },
    {
      q:'You are a wing on a defensive-zone faceoff. First job?',
      o:[
        'Watch the puck drop',
        'Get your body and stick on the man across from you',
        'Skate to the front of the net',
        'Head up ice for a breakaway'
      ],
      a:1,
      why:'Your man is your job. Beat him to any loose puck and the draw does not even matter.'
    }
  ],
  placeq:[
    {
      pos:'C',
      fr:0,
      ask:'Set up for the draw. Where is the centre?'
    },
    {
      pos:'RD',
      fr:0,
      ask:'Where does the net-side D start on this draw?'
    }
  ],
  videos:[
    {
      id:'VhKwoN9m_VU',
      t:'Hockey Faceoff Positions For Beginners (U8)',
      c:'Samantha Hilde',
      w:'The simplest possible version. Watch this first.'
    },
    {
      id:'pPpRW8GK-Gg',
      t:'Hockey D-Zone Face-Off Pt. 1',
      c:'Coach Matt',
      w:'Defensive zone draw assignments, position by position.'
    },
    {
      id:'NRHedJxSB-s',
      t:'Offensive Zone Face-off Setup - 3 Plays',
      c:'Coach K',
      w:'Three real O-zone set plays off the draw.'
    },
    {
      id:'oeG_5mNKzMg',
      t:'Steve Spott - Defensive Zone Faceoff Options',
      c:'The Coaches Site',
      w:'Pro-level option tree. Parent reference.'
    }
  ],
  searchq:'hockey faceoff positioning',
  keys:{
    base:[
      'faceoff',
      'face off',
      'face-off',
      'draw',
      'the dot',
      'set play',
      'off the draw',
      'circle'
    ],
    v:{
      dzone:['defensive','d zone','dzone','our end','defend','our own end'],
      ozone:['offensive','o zone','ozone','their end','attack','their zone']
    }
  }
},

/* ---- Offensive zone play (O, order 100) ---- */
{
  id:'ozone',
  name:'Offensive zone play',
  group:'O',
  ages:['10U','12U','14U'],
  about:'We have it in their end. Keep it and score.',
  focus:[117,-5,90,95],
  roster:['C','LW','RW','LD','RD'],
  variants:[
    {
      id:'cycle',
      name:'Cycle low, then low-to-high',
      note:'How you keep the puck for a full minute.',
      frames:[
        {
          t:0,
          cue:'We have it on the wall below the circle. Nobody stands still down here.',
          us:{LW:[180,10], C:[172,26], RW:[180,56], LD:[132,28], RD:[132,58]},
          them:{XG:[187,42.5], X1:[184,16], X2:[183,44], X3:[174,38], X4:[150,24], X5:[150,60]},
          puck:[
            180,
            10.5,
            'LW'
          ]
        },
        {
          t:0.32,
          cue:'Pressured, so LW cycles back DOWN toward the corner - away from trouble - and C comes to the wall to support.',
          us:{LW:[184,16], C:[176,14], RW:[182,52]},
          them:{X1:[186,20], X3:[176,34]},
          puck:[
            184,
            16.5,
            'LW'
          ]
        },
        {
          t:0.55,
          cue:'Puck to C on the wall. Your first look is NOT the net. It is your D at the point.',
          us:{C:[176,13], LW:[184,20], RW:[183,50], LD:[133,26]},
          them:{X1:[184,22], X3:[174,32]},
          puck:[
            176,
            13.5,
            'C'
          ]
        },
        {
          t:0.75,
          cue:'Low to high. C sends it up to LD, then TURNS AND DRIVES THE NET. That is the whole play.',
          us:{C:[178,26], LD:[136,30], LW:[182,16], RW:[184,46]},
          them:{X3:[172,34], X1:[180,20]},
          puck:[
            136,
            30.5,
            'LD'
          ]
        },
        {
          t:1,
          cue:'LD shoots through the lane. C is stopped at the net with his stick on the ice. Rebounds are goals.',
          us:{C:[182,40], LD:[142,36], RW:[184,48], LW:[180,18], RD:[134,56]},
          them:{X2:[184,44], X3:[168,38]},
          puck:[178,43]
        }
      ]
    },
    {
      id:'drive',
      name:'Net drive off the wall',
      note:'When their D gives you the inside, take it.',
      frames:[
        {
          t:0,
          cue:'Their D gave you the inside lane. Do not cycle - go.',
          us:{LW:[178,12], C:[170,30], RW:[180,58], LD:[132,28], RD:[132,58]},
          them:{XG:[187,42.5], X1:[180,20], X2:[183,46], X3:[168,36], X4:[150,24], X5:[150,60]},
          puck:[
            178,
            12.5,
            'LW'
          ]
        },
        {
          t:0.35,
          cue:'LW cuts to the net. C reads it and fills the spot LW just left - somebody is ALWAYS the high support man.',
          us:{LW:[183,26], C:[174,18], RW:[183,52]},
          them:{X1:[182,24], X3:[172,34]},
          puck:[
            183,
            26.5,
            'LW'
          ]
        },
        {
          t:0.65,
          cue:'Goalie stops the first one. RW is already at the far post because he did not watch - he went.',
          us:{RW:[184,50], C:[178,22], LW:[184,36]},
          them:{X2:[182,44]},
          puck:[184,40]
        },
        {
          t:1,
          cue:'Rebound on the back door. Almost every goal at your age happens within five feet of the net.',
          us:{RW:[185,48], C:[180,30], LW:[183,38], LD:[136,30], RD:[134,56]},
          them:{X2:[181,44], X3:[170,36]},
          puck:[185,48]
        }
      ]
    }
  ],
  coach:{
    C:{
      job:'Low support, then the net. You are the connector between the wall and the point.',
      look:[
        {
          n:1,
          label:'The puck on the wall',
          to:'puck'
        },
        {
          n:2,
          label:'Your D at the point - your first pass',
          to:'LD'
        },
        {
          n:3,
          label:'The net - where you go the instant you pass it',
          to:'theirNet'
        }
      ],
      do:[
        'Support the wall from below - give your winger an easy short pass out of trouble.',
        'When you get it low, look UP first. Low-to-high beats forcing it to the net.',
        'The second you pass it, drive the net. Stop AT the net, do not swing past it.',
        'Stick on the ice, eyes on the puck, and be ready for an ugly rebound.'
      ],
      mistake:'Passing it up to the point and then coasting to watch the shot. The rebound is the whole reason you are down there.',
      remember:'Get it, give it, GO to the net.'
    },
    LW:{
      job:'Win the wall, protect the puck, and cycle when you are stuck.',
      look:[
        {
          n:1,
          label:'The man on you - which shoulder?',
          to:'X1'
        },
        {
          n:2,
          label:'Your center below/behind you',
          to:'C'
        },
        {
          n:3,
          label:'The point for the low-to-high',
          to:'LD'
        }
      ],
      do:[
        'Feet always moving. A stopped player on the wall loses the puck.',
        'When you are pressured, cycle back down low. Never force it up the wall into a shin pad.',
        'Body between the puck and the defender, puck on your far side.',
        'If you cut to the net, go all the way. Half a drive does nothing.'
      ],
      mistake:'Trying to beat two guys along the wall. That turnover becomes their breakaway.'
    },
    RW:{
      job:'Weak side. Be at the far post and in the shooting lane\'s rebound spot.',
      look:[
        {
          n:1,
          label:'The puck across the ice',
          to:'puck'
        },
        {
          n:2,
          label:'The back door post',
          to:'theirNet'
        },
        {
          n:3,
          label:'Your D at the far point',
          to:'RD'
        }
      ],
      do:[
        'Get to the far post on every shot. That is where the puck goes most often.',
        'Stay a bit wide of the goalie so you are not in his way and he cannot see you.',
        'Stick on the ice, blade flat, ready for a tip.',
        'If the puck goes to your side, you become the wall guy and C supports you.'
      ],
      mistake:'Standing at the top of the circle admiring the play. Weak-side goals come from the paint.'
    },
    LD:{
      job:'Strong-side point. Walk the line, get shots through, and keep pucks in.',
      look:[
        {
          n:1,
          label:'The puck below you',
          to:'puck'
        },
        {
          n:2,
          label:'A shooting lane to the net',
          to:'theirNet'
        },
        {
          n:3,
          label:'The blue line behind you',
          to:[125,28]
        }
      ],
      do:[
        'Walk toward the middle before you shoot - that opens a lane.',
        'Get it through and get it low. A blocked shot is a rush against.',
        'Keep pucks in at the line. That single skill wins games.',
        'Shoot for sticks and shin pads at the net, not for the top corner.'
      ],
      mistake:'One-timing it straight into the shin pads of the first guy, over and over.'
    },
    RD:{
      job:'Weak-side point and the safety. You are also the last man back.',
      look:[
        {
          n:1,
          label:'The puck',
          to:'puck'
        },
        {
          n:2,
          label:'Their forward getting ready to leave',
          to:'X3'
        },
        {
          n:3,
          label:'The middle of the neutral zone behind you',
          to:[128,42]
        }
      ],
      do:[
        'Stay a little higher than your partner. One D is always the safety.',
        'Be a real option - if they get it to you, shoot or move it fast.',
        'Read the turnover early. You should be turning before the puck is loose.',
        'Never both D below the blue line at once.'
      ],
      mistake:'Sneaking down for a goal and getting caught. Now they are on a two-on-one.'
    }
  },
  phase:'O',
  order:100,
  phases:{
    cycle:['O','O','O','O','O'],
    drive:['O','O','O','O']
  },
  next:{
    cycle:{
      sit:'rush',
      v:'gap',
      label:'They blocked it and took off. Now they are coming at us.'
    },
    drive:{
      sit:'rush',
      v:'gap',
      label:'They got the rebound out. Now they are coming at us.'
    }
  },
  roles:{
    X1:'on the wall',
    X2:'net front',
    X3:'in the slot',
    X4:'their D',
    X5:'their D',
    XG:'goalie'
  },
  tests:[
    {
      q:'You have the puck low on the wall in their end and you are getting pressured. What do you do?',
      o:[
        'Force it up the boards into a shin pad',
        'Cycle back down low, away from the pressure',
        'Fire it at the net from the corner',
        'Cut into the middle through two guys'
      ],
      a:1,
      why:'Cycling low keeps the puck. Forcing it up the wall into a defender is a turnover and a rush the other way.'
    },
    {
      q:'You get the puck low in their end. Where do you look FIRST?',
      o:['The net','Your D at the point','The referee','Back at your own end'],
      a:1,
      why:'Low to high. Get it up to the point, THEN go to the net for the rebound - do not stand and admire your own pass.'
    },
    {
      q:'At your age, where do almost all the goals get scored from?',
      o:['The blue line','Inside five feet of the net','The corner','Centre ice'],
      a:1,
      why:'That is exactly why the net drive matters. Stop at the net, stick on the ice, be ready for something ugly.'
    }
  ],
  placeq:[
    {
      pos:'C',
      fr:3,
      ask:'The puck just went up to your D at the point. Where should the centre be?'
    },
    {
      pos:'RW',
      fr:0,
      ask:'Where does the weak-side wing set up in the offensive zone?'
    }
  ],
  videos:[
    {
      id:'dr3ECi9N2-E',
      t:'Cycling Basics in the Offensive Zone',
      c:'Evolution Hockey',
      w:'Right vocabulary level for U10. Start here.'
    },
    {
      id:'Bi5yWL5TT6I',
      t:'Offensive Concept: "The Cycle" Pt. 1',
      c:'Coach Matt',
      w:'Why you turn back down low instead of forcing it up the wall.'
    },
    {
      id:'kWaketBZWrg',
      t:'How To Utilize The Cycle In The Offensive Zone - Billy Jaffe',
      c:'NESN',
      w:'Broadcast-quality visuals. Great on a big screen.'
    },
    {
      id:'S4qpRDAnq9s',
      t:'Offensive Zone Strategy: Attacking the Net',
      c:'TaiwanHockey',
      w:'Net-front presence - the "stop at the net" habit.'
    }
  ],
  searchq:'hockey offensive zone cycle low to high',
  keys:{
    base:[
      'offensive zone',
      'o zone',
      'ozone',
      'their end',
      'cycle',
      'cycling',
      'low to high',
      'possession',
      'work the puck',
      'down low',
      'net front',
      'sustain',
      'keep it in their end',
      'o zone play'
    ],
    v:{
      cycle:['cycle','cycling','low to high','wall','spin','possession','protect the puck'],
      drive:[
        'net drive',
        'drive the net',
        'back door',
        'rebound',
        'attack the net',
        'straight to the net'
      ]
    }
  }
},

/* ---- Power play (5 on 4) (O, order 110) ---- */
{
  id:'pp',
  name:'Power play (5 on 4)',
  group:'O',
  ages:['12U','14U','16U','18U'],
  about:'One extra man. Hold your spot, move the puck.',
  focus:[117,-5,90,95],
  roster:['LD','LW','C','RW','RD'],
  variants:[
    {
      id:'131',
      name:'1-3-1: point, three across, net front',
      note:'RD is playing the net-front spot here - your coach may use a forward there.',
      frames:[
        {
          t:0,
          cue:'Power play. Five spots, and if everybody holds theirs the puck does the work.',
          us:{LD:[133,42.5], LW:[163,22], C:[167,42.5], RW:[163,63], RD:[183,42.5]},
          them:{XG:[187,42.5], X1:[150,32], X2:[150,53], X3:[174,30], X4:[174,55]},
          puck:[
            133,
            43,
            'LD'
          ]
        },
        {
          t:0.3,
          cue:'Point to the half wall. The box HAS to shift - and shifting takes them time.',
          us:{LW:[163,20], C:[167,42.5], LD:[134,42.5]},
          them:{X1:[154,26], X3:[172,26], X2:[152,52]},
          puck:[
            163,
            21,
            'LW'
          ]
        },
        {
          t:0.55,
          cue:'Now the seam. C in the middle is open because all four of them slid toward the puck.',
          us:{C:[166,42.5], RW:[164,64], RD:[183,44]},
          them:{X3:[170,28], X1:[156,30]},
          puck:[
            166,
            42.5,
            'C'
          ]
        },
        {
          t:0.8,
          cue:'One touch to the far half wall, or one shot from the middle. Both are good - just do it in ONE touch.',
          us:{RW:[164,62], C:[166,42.5]},
          them:{X4:[170,56], X2:[156,50]},
          puck:[
            164,
            62,
            'RW'
          ]
        },
        {
          t:1,
          cue:'Shot from the far half wall, net-front man tips it. Move the puck faster than they can slide.',
          us:{RD:[183,45], C:[172,42.5], LD:[136,42.5]},
          them:{X4:[174,52]},
          puck:[182,45]
        }
      ]
    }
  ],
  coach:{
    C:{
      job:'The bumper - the middle man. Hardest spot to cover and hardest spot to play.',
      look:[
        {
          n:1,
          label:'The puck',
          to:'puck'
        },
        {
          n:2,
          label:'The seam - the gap between their two low men',
          to:[176,42.5]
        },
        {
          n:3,
          label:'The net for a quick shot',
          to:'theirNet'
        }
      ],
      do:[
        'Stay between the circles, around the dots, in the middle. Small movements only.',
        'Show your stick blade to whoever has the puck. Give him a target.',
        'One touch. Shoot it or move it - never hold it in the middle.',
        'If they cover you, slide a few feet to a new window. Do not leave.'
      ],
      mistake:'Skating around trying to get open. In the middle you get open by standing still in the right spot and moving your stick, not your feet.',
      remember:'Stay in the seam. One touch.'
    },
    LD:{
      job:'The point. You are the quarterback - you make them move.',
      look:[
        {
          n:1,
          label:'Both half walls',
          to:'LW'
        },
        {
          n:2,
          label:'The bumper in the middle',
          to:'C'
        },
        {
          n:3,
          label:'The blue line behind you',
          to:[125,42.5]
        }
      ],
      do:[
        'Walk the line side to side. A moving point man breaks the box.',
        'Fake the shot to freeze them, then pass.',
        'Get shots THROUGH. Low, hard, and to a stick at the net.',
        'Number one job: keep the puck in the zone at the line.'
      ],
      mistake:'Standing in one spot and firing it into a shin pad every time. That is a clear and a fresh kill for them.'
    },
    LW:{
      job:'Half wall on your side. Catch, look, decide.',
      look:[
        {
          n:1,
          label:'The bumper in the middle',
          to:'C'
        },
        {
          n:2,
          label:'The net-front man',
          to:'RD'
        },
        {
          n:3,
          label:'The point',
          to:'LD'
        }
      ],
      do:[
        'Stay on the wall around the top of the circle. Do not drift.',
        'Catch it with your feet already pointed where you want to go.',
        'Look middle first - the seam pass is the best play on a power play.',
        'Shoot for tips and rebounds, not for corners.'
      ],
      mistake:'Skating into the middle with it and turning it over. On a power play the puck moves, not the players.'
    },
    RW:{
      job:'Far half wall. Be ready, because the puck comes fast when the box over-shifts.',
      look:[
        {
          n:1,
          label:'The puck across the ice',
          to:'puck'
        },
        {
          n:2,
          label:'The middle',
          to:'C'
        },
        {
          n:3,
          label:'The net-front man',
          to:'RD'
        }
      ],
      do:[
        'Hold your spot on the wall even when the puck is nowhere near you.',
        'Get your stick on the ice before the pass gets there.',
        'A one-timer from the far half wall is a great power-play shot. Practice it.',
        'When they collapse to you, the middle just opened. Look there first.'
      ],
      mistake:'Wandering low or high to "get involved" and leaving your side of the ice empty.'
    },
    RD:{
      job:'Net front. Screen, tip, and live in the blue paint.',
      look:[
        {
          n:1,
          label:'The puck',
          to:'puck'
        },
        {
          n:2,
          label:'The goalie\'s eyes - block them',
          to:'theirNet'
        },
        {
          n:3,
          label:'The rebound spot beside you',
          to:[184,50]
        }
      ],
      do:[
        'Stand where the goalie cannot see through you, just off the top of the crease.',
        'Stick on the ice, blade flat, ready to tip anything.',
        'Do not turn to watch the shot. Watch the goalie and the puck.',
        'Get the rebound before anyone else even reacts.'
      ],
      mistake:'Standing beside the net where you screen nobody, or getting pushed out and staying out.'
    }
  },
  phase:'O',
  order:110,
  phases:{
    '131':['O','O','O','O','O']
  },
  next:{},
  roles:{
    X1:'killer',
    X2:'killer',
    X3:'killer',
    X4:'killer',
    XG:'goalie'
  },
  tests:[
    {
      q:'You are the bumper - the player in the middle on the power play. How do you get open?',
      o:[
        'Skate around looking for space',
        'Stand still in the seam and show your stick blade',
        'Go to the front of the net',
        'Drop back to the point'
      ],
      a:1,
      why:'In the middle you get open by being in the right spot with your blade on the ice, not by skating around.'
    },
    {
      q:'On a power play, what should move faster - the players or the puck?',
      o:['The players','The puck','Both the same','Neither - hold on to it'],
      a:1,
      why:'The puck moves, the players hold their spots. Make the box slide until it breaks.'
    }
  ],
  placeq:[
    {
      pos:'C',
      fr:0,
      ask:'Set up the 1-3-1. Where does the bumper stand?'
    },
    {
      pos:'LD',
      fr:0,
      ask:'Where does the point man set up?'
    }
  ],
  videos:[
    {
      id:'8k7cfM4U-FI',
      t:'Power Play Basics: Umbrella (1-3-1) Setup',
      c:'PowerTech Hockey',
      w:'The same five spots as the rink above.'
    },
    {
      id:'y63cHxYlMRw',
      t:'Hockey Power Play: Umbrella',
      c:'Weiss Tech Hockey',
      w:'Coach-facing breakdown of the shape.'
    },
    {
      id:'tL5uUN8am1o',
      t:'The Most Dangerous Spot on the Ice: The Bumper Explained',
      c:'Weiss Tech Hockey',
      w:'If he plays the middle on the PP, watch this twice.'
    }
  ],
  searchq:'hockey power play 1-3-1 umbrella',
  keys:{
    base:[
      'power play',
      'powerplay',
      'pp',
      '5 on 4',
      'five on four',
      'man advantage',
      'up a man',
      '1-3-1',
      '131',
      'umbrella',
      'bumper',
      'half wall',
      'seam',
      'one three one'
    ],
    v:{
      '131':['1-3-1','131','one three one','umbrella','bumper','seam']
    }
  }
}
];
