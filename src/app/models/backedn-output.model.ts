export interface BackendOutput {
    title: string
    article: string
    message: string

    emotion: {
        anger: number
        disgust: number
        fear: number
        joy: number
        sadness: number
        surprise: number
        neutral: number
    }

    sentiment: {
        positive: number
        negative: number
        neutral: number
    }

    metrics: {
        cosineSim: number
        jaccardBigrams: number
        jaccardWords: number
        lenDif: number
        lenRatio: number
        normEditDist: number
        tfIdfSim: number
    }
}