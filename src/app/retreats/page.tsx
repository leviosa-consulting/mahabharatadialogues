import React from 'react'

const RetreatSchedule: React.FC = () => {
  return (
    <div className="min-h-screen bg-white ">
      {/* Header */}

      <div className="bg-[#282828] text-white py-12 md:py-24 px-6  relative overflow-hidden">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-center gap-8">
          {/* Left */}
          <div className="flex-1 text-center md:text-left">
            <div className="text-xs md:text-sm mb-2">Mahabharata Dialogues</div>
            <h1 className="text-4xl md:text-5xl font-bold">The Retreat</h1>
          </div>

          {/* Divider (only md+) */}
          <div className="hidden md:block w-px h-24 bg-white/60" />

          {/* Right */}
          <div className="flex-1 text-center md:text-left">
            <p className="text-sm md:text-base italic leading-relaxed">
              An immersive two-day residential retreat with every moment
              revolving around the Mahabharata.
            </p>
          </div>
        </div>
      </div>

      {/* Day circles */}
      <div className="w-full hidden  relative z-10 mx-auto -mt-18 md:flex flex-col md:flex-row items-center justify-center gap-8 md:gap-84">
        {/* Day 1 */}
        <div className="w-40 h-40 md:w-44 md:h-44 rounded-full bg-red-600 shadow-xl text-white flex items-center justify-center">
          <div className="text-center leading-tight">
            <div className="text-xs tracking-wide mb-1">-DAY 1-</div>
            <div className="text-xl md:text-2xl font-semibold">03 Aug 2024</div>
            <div className="text-sm mt-1">Saturday</div>
          </div>
        </div>

        {/* Day 2 */}
        <div className="w-40 h-40 md:w-44 md:h-44 rounded-full bg-red-600 shadow-xl text-white flex items-center justify-center">
          <div className="text-center leading-tight">
            <div className="text-xs tracking-wide mb-1">-DAY 2-</div>
            <div className="text-xl md:text-2xl font-semibold">04 Aug 2024</div>
            <div className="text-sm mt-1">Sunday</div>
          </div>
        </div>
      </div>

      {/* Day circle Mobile*/}
      <div className="sm:hidden flex justify-center items-center mt-4">
        <div className="w-40 h-40 md:w-44 md:h-44 rounded-full bg-red-600 shadow-xl text-white flex items-center justify-center">
          <div className="text-center leading-tight">
            <div className="text-xs tracking-wide mb-1">-DAY 1-</div>
            <div className="text-xl md:text-2xl font-semibold">03 Aug 2024</div>
            <div className="text-sm mt-1">Saturday</div>
          </div>
        </div>
      </div>
      {/* Schedule Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 md:mx-10 lg:mx-30">
        {/* Day 1 Column */}
        <div className="md:border-r border-gray-200">
          {/* Day 1 Schedule */}
          <div className="px-6 py-6 md:px-8 md:py-8 space-y-4">
            {/* Breakfast */}
            <div className="bg-cyan-300 text-white px-4 py-2 font-bold text-[16px] md:text-lg flex justify-between items-center">
              <span>Breakfast</span>
              <span className="text-[16px] md:text-lg">08:45 - 09:30</span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-start gap-3">
                <div className="flex-1">
                  <div className="font-semibold text-md leading-snug">
                    • Introduction & Icebreaker
                  </div>
                  <div className="text-sm text-gray-600 leading-tight mt-0.5">
                    Get to know your fellow retreat participants and facilitator
                  </div>
                </div>
                <div className="text-md whitespace-nowrap pt-0.5">
                  09:30 - 10:00
                </div>
              </div>

              <div className="flex justify-between items-start gap-3">
                <div className="flex-1">
                  <div className="font-semibold text-md leading-snug">
                    • Vows
                  </div>
                  <div className="text-sm text-gray-600 leading-tight mt-0.5">
                    Why vows take a new imprint this week
                  </div>
                </div>
                <div className="text-md whitespace-nowrap pt-0.5">
                  10:00 - 11:15
                </div>
              </div>
            </div>

            {/* High Tea with cookies */}
            <div className="bg-cyan-300 text-white px-4 py-2 font-bold text-[16px] md:text-lg flex justify-between items-center">
              <span>High Tea with cookies</span>
              <span className="ttext-[16px] md:text-lg">11:15 - 11:35</span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-start gap-3">
                <div className="flex-1">
                  <div className="font-semibold text-md leading-snug">
                    • Dance Drama
                  </div>
                  <div className="text-sm text-gray-600 leading-tight mt-0.5">
                    Stories we tell and tales we dance and shout!
                  </div>
                </div>
                <div className="text-md whitespace-nowrap pt-0.5">
                  11:35 - 12:50
                </div>
              </div>

              <div className="flex justify-between items-start gap-3">
                <div className="flex-1">
                  <div className="font-semibold text-md leading-snug">
                    • Indraprastha
                  </div>
                  <div className="text-sm text-gray-600 leading-tight mt-0.5">
                    How the name changes, that drama and its aftermath
                  </div>
                </div>
                <div className="text-md whitespace-nowrap pt-0.5">
                  12:55 - 13:30
                </div>
              </div>
            </div>

            {/* Lunch */}
            <div className="bg-cyan-300 text-white px-4 py-2 font-bold text-[16px] md:text-lg flex justify-between items-center">
              <span>Lunch</span>
              <span className="text-[16px] md:text-lg">13:30 - 14:30</span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-start gap-3">
                <div className="flex-1">
                  <div className="font-semibold text-md leading-snug">
                    • Guess in 10
                  </div>
                  <div className="text-sm text-gray-600 leading-tight mt-0.5">
                    Can you guess the character? Expose your skills
                  </div>
                </div>
                <div className="text-md whitespace-nowrap pt-0.5">
                  14:30 - 14:50
                </div>
              </div>

              <div className="flex justify-between items-start gap-3">
                <div className="flex-1">
                  <div className="font-semibold text-md leading-snug">
                    • Mahabharata is yeu!
                  </div>
                  <div className="text-sm text-gray-600 leading-tight mt-0.5">
                    An unvarnished approach and perspective walk you
                  </div>
                </div>
                <div className="text-md whitespace-nowrap pt-0.5">
                  14:50 - 15:50
                </div>
              </div>
            </div>

            {/* High Tea with Pakodas */}
            <div className="bg-cyan-300 text-white px-4 py-2 font-bold text-[16px] md:text-lg flex justify-between items-center">
              <span>High Tea with Pakodas</span>
              <span className="text-[16px] md:text-lg">15:50 - 16:15</span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-start gap-3">
                <div className="flex-1">
                  <div className="font-semibold text-md leading-snug">
                    • The Maha Quiz
                  </div>
                  <div className="text-sm text-gray-600 leading-tight mt-0.5">
                    Open your mind to amazement
                  </div>
                </div>
                <div className="text-md whitespace-nowrap pt-0.5">
                  16:15 - 16:45
                </div>
              </div>

              <div className="flex justify-between items-start gap-3">
                <div className="flex-1">
                  <div className="font-semibold text-md leading-snug">
                    • Poetry recitation
                  </div>
                  <div className="text-sm text-gray-600 leading-tight mt-0.5">
                    A look the rhymes, verse, rhythmed too
                  </div>
                </div>
                <div className="text-md whitespace-nowrap pt-0.5">
                  16:45 - 17:30
                </div>
              </div>
            </div>

            {/* Take a break */}
            <div className="bg-cyan-300 text-white px-4 py-2 font-bold text-[16px] md:text-lg flex justify-between items-center">
              <span>Take a break</span>
              <span className="text-[16px] md:text-lg">17:30 - 18:15</span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-start gap-3">
                <div className="flex-1">
                  <div className="font-semibold text-md leading-snug">
                    • Draupadi
                  </div>
                  <div className="text-sm text-gray-600 leading-tight mt-0.5">
                    Perspectives on the life of Draupadi
                  </div>
                </div>
                <div className="text-md whitespace-nowrap pt-0.5">
                  19:15 - 20:15
                </div>
              </div>
            </div>

            {/* Dinner */}
            <div className="bg-cyan-300 text-white px-4 py-2 font-bold text-[16px] md:text-lg flex justify-between items-center">
              <span>Dinner</span>
              <span className="text-[16px] md:text-lg">20:15 - 21:30</span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-start gap-3">
                <div className="flex-1">
                  <div className="font-semibold text-ms leading-snug">
                    • Farzi Mushiara
                  </div>
                  <div className="text-sm text-gray-600 leading-tight mt-0.5">
                    Impromptu shayari, or poems
                  </div>
                </div>
                <div className="text-md whitespace-nowrap pt-0.5">
                  21:30 - 22:15
                </div>
              </div>

              <div className="flex justify-between items-start gap-3">
                <div className="flex-1">
                  <div className="font-semibold text-md leading-snug">
                    • Khronology/chai with Prateek
                  </div>
                  <div className="text-sm text-gray-600 leading-tight mt-0.5">
                    A last word of wisdom before we walk death into Mahabharata
                    yourself's Khandav
                  </div>
                </div>
                <div className="text-md whitespace-nowrap pt-0.5">
                  22:15 - 01:00
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Day 2 Column */}

        {/* Day circle Mobile*/}
        <div className="sm:hidden flex justify-center items-center mt-4">
          <div className="w-40 h-40 md:w-44 md:h-44 rounded-full bg-red-600 shadow-xl text-white flex items-center justify-center">
            <div className="text-center leading-tight">
              <div className="text-xs tracking-wide mb-1">-DAY 2-</div>
              <div className="text-xl md:text-2xl font-semibold">
                04 Aug 2024
              </div>
              <div className="text-sm mt-1">Sunday</div>
            </div>
          </div>
        </div>
        <div>
          {/* Day 2 Schedule */}
          <div className="px-6 py-6 md:px-8 md:py-8 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-start gap-3">
                <div className="flex-1">
                  <div className="font-semibold text-md leading-snug">
                    • Storytelling masterclass ♦
                  </div>
                  <div className="text-sm text-gray-600 leading-tight mt-0.5">
                    as in Mahabharata
                  </div>
                </div>
                <div className="text-md whitespace-nowrap pt-0.5">
                  07:00 - 08:00
                </div>
              </div>

              <div className="flex justify-between items-start gap-3">
                <div className="flex-1">
                  <div className="font-semibold text-md leading-snug">
                    • What's in a name/a ♦
                  </div>
                  <div className="text-sm text-gray-600 leading-tight mt-0.5">
                    Take some stories early in the morning
                  </div>
                </div>
                <div className="text-md whitespace-nowrap pt-0.5">
                  07:00 - 08:00
                </div>
              </div>

              <div className="flex justify-between items-start gap-3">
                <div className="flex-1">
                  <div className="font-semibold text-md leading-snug">
                    • What's in a name/b
                  </div>
                  <div className="text-sm text-gray-600 leading-tight mt-0.5">
                    Some fun stories about enduring names, naming and denomizing
                  </div>
                </div>
                <div className="text-md whitespace-nowrap pt-0.5">
                  07:00 - 08:00
                </div>
              </div>
            </div>

            {/* Breakfast */}
            <div className="bg-cyan-300 text-white px-4 py-2 font-bold text-[16px] md:text-lg flex justify-between items-center">
              <span>Breakfast</span>
              <span className="text-[16px] md:text-lg">08:00 - 09:30</span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-start gap-3">
                <div className="flex-1">
                  <div className="font-semibold text-md leading-snug">
                    • The 7 (nine) Strategy Game
                  </div>
                  <div className="text-sm text-gray-600 leading-tight mt-0.5">
                    A relook at the Strategies (or may be not) ahead
                  </div>
                </div>
                <div className="text-md whitespace-nowrap pt-0.5">
                  09:30 - 10:15
                </div>
              </div>

              <div className="flex justify-between items-start gap-3">
                <div className="flex-1">
                  <div className="font-semibold text-md leading-snug">
                    • The Butterfly Effect
                  </div>
                  <div className="text-sm text-gray-600 leading-tight mt-0.5">
                    Consequences
                  </div>
                </div>
                <div className="text-md whitespace-nowrap pt-0.5">
                  10:15 - 11:00
                </div>
              </div>
            </div>

            {/* High Tea with cookies */}
            <div className="bg-cyan-300 text-white px-4 py-2 font-bold text-[16px] md:text-lg flex justify-between items-center">
              <span>High Tea with cookies</span>
              <span className="text-[16px] md:text-lg">11:00 - 11:30</span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-start gap-3">
                <div className="flex-1">
                  <div className="font-semibold text-md leading-snug">
                    • Communicate like Krishna
                  </div>
                  <div className="text-sm text-gray-600 leading-tight mt-0.5">
                    Lesson from Krsna. Conversations and learning
                  </div>
                </div>
                <div className="text-md whitespace-nowrap pt-0.5">
                  11:30 - 12:30
                </div>
              </div>

              <div className="flex justify-between items-start gap-3">
                <div className="flex-1">
                  <div className="font-semibold text-md leading-snug">
                    • karmanye vadhikaraste
                  </div>
                  <div className="text-sm text-gray-600 leading-tight mt-0.5">
                    A lyrical dissection with live music
                  </div>
                </div>
                <div className="text-md whitespace-nowrap pt-0.5">
                  12:30 - 13:30
                </div>
              </div>
            </div>

            {/* Lunch */}
            <div className="bg-cyan-300 text-white px-4 py-2 font-bold text-[16px] md:text-lg flex justify-between items-center">
              <span>Lunch</span>
              <span className="text-[16px] md:text-lg">13:30 - 14:30</span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-start gap-3">
                <div className="flex-1">
                  <div className="font-semibold text-md leading-snug">
                    • The Last Dialogue
                  </div>
                  <div className="text-sm text-gray-600 leading-tight mt-0.5">
                    Conversation about deep questions in
                  </div>
                </div>
                <div className="text-md whitespace-nowrap pt-0.5">
                  14:30 - 16:15
                </div>
              </div>
            </div>

            {/* High Tea with Pakoda */}
            <div className="bg-cyan-300 text-white px-4 py-2 font-bold text-[16px] md:text-lg flex justify-between items-center">
              <span>High Tea with Pakoda</span>
              <span className="text-[16px] md:text-lg">16:15 - 16:40</span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-start gap-3">
                <div className="flex-1">
                  <div className="font-semibold text-md leading-snug">
                    • Conversations about Mahabharata
                  </div>
                  <div className="text-sm text-gray-600 leading-tight mt-0.5">
                    Any final thoughts, perspectives, observations, and some
                    stories from the two days
                  </div>
                </div>
                <div className="text-md whitespace-nowrap pt-0.5">
                  16:40 - 17:30
                </div>
              </div>

              <div className="flex justify-between items-start gap-3">
                <div className="flex-1">
                  <div className="font-semibold text-md leading-snug">
                    • Conclusion
                  </div>
                </div>
                <div className="text-md whitespace-nowrap pt-0.5">
                  17:30 - 18:00
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-md text-gray-500 py-4 border-t border-gray-200">
        * Optional/Simultaneous events
      </div>
    </div>
  )
}

export default RetreatSchedule
