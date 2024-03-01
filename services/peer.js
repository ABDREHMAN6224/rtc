class PeerService{
    constructor(){
        if(!this.peer) {
            this.peer = new RTCPeerConnection({
                iceServers: [
                    {
                        urls: "stun:stun.l.google.com:19302"
                    }
                ]
            });
        }
    }
    async getAnswer(offer){
        if(this.peer){
            await this.peer.setRemoteDescription(new RTCSessionDescription(offer));
            const answer = await this.peer.createAnswer();
            await this.peer.setLocalDescription(answer);
            return answer;
        }
    }
    async getOffer(){
        if(!this.peer) {
            this.peer = new RTCPeerConnection({
                iceServers: [
                    {
                        urls: "stun:stun.l.google.com:19302"
                    }
                ]
            });
        }
        const offer = await this.peer.createOffer();
        await this.peer.setLocalDescription(new RTCSessionDescription(offer));
        return offer;
    }
    async setLocalDescription(offer){
        if(this.peer){
            await this.peer.setLocalDescription(new RTCSessionDescription(offer));
        }
    }
}

export default new PeerService();