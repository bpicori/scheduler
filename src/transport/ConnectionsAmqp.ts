/**
 * Created by bpicori on 19-02-06
 */
import { connect, Connection } from 'amqplib';

export class ConnectionsAmqp {

  /**
   * Get rabbit connection
   * @param rabbitHost
   */
  public static async getConnection(rabbitHost: string): Promise<Connection> {
    if (typeof this.connections === 'undefined') {
      this.connections = new Map();
    }
    const connection = this.connections.get(rabbitHost);
    if (!connection) {
      const newConnection = await connect(rabbitHost);
      this.connections.set(rabbitHost, newConnection);
      return newConnection;
    }
    return connection;
  }
  private static connections: Map<string, any>;
}
