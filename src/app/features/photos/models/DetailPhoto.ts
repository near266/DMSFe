export class DetailPhoto {
    checkIn: CheckIn
    album: Album
    image: string[]
}

export class CheckIn {
    createdBy: string
    createdDate: string
}

export class Album {
    id: string
    albumName: string
}
