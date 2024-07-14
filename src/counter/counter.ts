import { GuildMember } from 'discord.js'

export const DEFAULT_BASE_VALUE = 0

export const DEFAULT_LEEWAY = 3

export enum ValueEvolution {
    PASS,
    FAIL_COUNT,
    FAIL_USER,
    BEST,
    MILESTONE,
    SABOTAGE,
}

class Counter {
    public value = 0
    public best = 0
    public lastValue = 0
    public lastUser = ''
    public fails = new Map<string, number>()

    increment(nb: number, user: GuildMember): ValueEvolution {
        //If fail
        const fail = this.getFailType(nb, user)
        if (fail !== ValueEvolution.PASS) {
            this.manageFailure(user)
            return fail
        }

        //If Ok
        this.value += 1
        this.lastUser = user.id

        //If special event
        if (this.updateBest()) return ValueEvolution.BEST
        if (this.isMilestone()) return ValueEvolution.MILESTONE
        return ValueEvolution.PASS
    }

    setValue(value: number) {
        if (value < 0) throw new Error('The value must be > 0.')
        this.value = value
        this.lastUser = ''
    }

    reset() {
        this.setValue(DEFAULT_BASE_VALUE)
    }

    resurrect() {
        this.setValue(this.lastValue)
    }

    private manageFailure(user: GuildMember) {
        this.updateBest()
        this.lastValue = this.value
        this.value = 0
        this.lastUser = ''
        if (!this.fails.has(user.id)) {
            this.fails.set(user.id, 1)
        } else {
            const failsNb = this.fails.get(user.id)
            if (!failsNb)
                throw new Error("Unable to find the user's fail count.")
            this.fails.set(user.id, failsNb)
        }
    }

    private updateBest() {
        if (this.isBest()) {
            this.best = this.value
            return true
        }
        return false
    }

    private isBest() {
        return this.value > this.best
    }

    private isMilestone() {
        return this.value % 100 === 0
    }

    private getFailType(nb: number, user: GuildMember): ValueEvolution {
        switch (true) {
            case Math.abs(nb - this.value) > DEFAULT_LEEWAY:
                return ValueEvolution.SABOTAGE
            case nb !== this.value + 1:
                return ValueEvolution.FAIL_COUNT
            case user.id === this.lastUser:
                return ValueEvolution.FAIL_USER
            default:
                return ValueEvolution.PASS
        }
    }
}

export const counter = new Counter()
