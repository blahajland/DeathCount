import { GuildMember } from 'discord.js'

export const DEFAULT_BASE_VALUE = 0

export enum ValueEvolution {
    PASS,
    FAIL,
    BEST,
    MILESTONE,
}

class Counter {
    public value = 0
    public best = 0
    public lastValue = 0
    public lastUser = ''
    public fails = new Map<string, number>()

    increment(nb: number, user: GuildMember): ValueEvolution {
        if (nb !== this.value + 1 || user.id === this.lastUser)
            return this.manageFailure(user)
        this.value += 1
        this.lastUser = user.id
        if (this.updateBest()) return ValueEvolution.BEST
        return this.isMilestone(this.value)
            ? ValueEvolution.MILESTONE
            : ValueEvolution.PASS
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
        return ValueEvolution.FAIL
    }

    private updateBest() {
        if (this.isBest(this.value)) {
            this.best = this.value
            return true
        }
        return false
    }

    private isBest(value: number) {
        return value > this.best
    }

    private isMilestone(value: number) {
        return value % 100 === 0
    }
}

export const counter = new Counter()
